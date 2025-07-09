"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/utils/axios";
import { motion } from "framer-motion";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

function loadCSS(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function applyBracketTransitions() {
  const $ = window.jQuery;
  if (!$) return;

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes fadeSlideIn {
      0% { opacity: 0; transform: translateX(50px) scale(0.9); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    #tournament .team { animation: fadeSlideIn 1.2s ease-out both; }
    #tournament .match { animation: fadeSlideIn 1.2s ease-out both; }
    #tournament .round { animation: fadeSlideIn 1.2s ease-out both; }
    #tournament .score { pointer-events: none !important; background: transparent !important; cursor: default !important; }
  `;
  document.head.appendChild(style);

  $("#tournament .team").each(function (i, el) {
    $(el).css("animation-delay", `${i * 0.1}s`);
  });
}

function setupBracketAnimations(bracketRef, scrollContainerRef) {
  const bracketEl = bracketRef.current;
  const scrollEl = scrollContainerRef.current;
  import('gsap/dist/gsap').then((mod) => {
    const gsap = mod.gsap || mod.default;
    window.gsap = gsap;
    return import('gsap/dist/ScrollTrigger').then((mod) => {
      const ScrollTrigger = mod.ScrollTrigger || mod.default;
      window.ScrollTrigger = ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const rounds = bracketEl.querySelectorAll('.round');
      const matches = bracketEl.querySelectorAll('.match');
      console.log('[DEBUG] (setupBracketAnimations) .round count:', rounds.length, '.match count:', matches.length);
      console.log('[DEBUG] (setupBracketAnimations) .round elements:', rounds);
      console.log('[DEBUG] (setupBracketAnimations) .match elements:', matches);

      // Setup scroller proxy
      ScrollTrigger.scrollerProxy(scrollEl, {
        scrollLeft(value) {
          if (arguments.length) scrollEl.scrollLeft = value;
          return scrollEl.scrollLeft;
        },
        scrollTop(value) {
          if (arguments.length) scrollEl.scrollTop = value;
          return scrollEl.scrollTop;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: scrollEl.clientWidth,
            height: scrollEl.clientHeight
          };
        },
        pinType: scrollEl.style.transform ? "transform" : "fixed"
      });

      ScrollTrigger.addEventListener("refresh", () => ScrollTrigger.update());
      ScrollTrigger.defaults({ scroller: scrollEl });

      // Animate .rounds with enhanced 3D effect
      rounds.forEach((el, i) => {
        gsap.fromTo(
          el,
          { 
            opacity: 0, 
            y: 120, 
            scale: 0.3, 
            rotateY: 360, // Full 360° rotation
            z: -300,     // More depth
            x: -100      // Slide in from left
          },
          {
            opacity: 1,
            y: 0,
            scale: 1.2,
            rotateY: 0,
            z: 0,
            x: 0,
            duration: 1.8,
            ease: 'elastic.out(1, 0.3)', // Playful bounce
            delay: i * 0.15 + Math.random() * 0.1, // Staggered with slight random variation
            scrollTrigger: {
              trigger: el,
              start: 'left 90%',
              end: 'left 40%', // Extended end for more visibility
              toggleActions: 'play none none reverse',
              scrub: 0.3, // Smoother scrub
              scroller: scrollContainerRef.current
            }
          }
        );
      });

      // Animate .matches with enhanced effects
      matches.forEach((el, i) => {
        gsap.fromTo(
          el,
          { 
            opacity: 0, 
            y: 100, 
            scale: 0.6, 
            rotateX: 45,    // Less extreme rotation
            rotateZ: 15,    // Slight tilt
            z: -50         // Subtle depth
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            rotateZ: 0,
            z: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 60%',
              toggleActions: 'play none none reverse',
              scrub: false,
              scroller: scrollContainerRef.current
            }
          }
        );
      });
      ScrollTrigger.refresh();
    });
  });
}

export default function BracketPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bracketRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const headerContainerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [numRounds, setNumRounds] = useState(0);
  const MIN_ZOOM = 0.8;
  const MAX_ZOOM = 1.2;
  const ZOOM_STEP = 0.1;

  const updateHeaderAlignment = useCallback(() => {
    if (!bracketRef.current || !headerContainerRef.current || numRounds === 0) return;
    const roundElements = bracketRef.current.querySelectorAll('.round');
    const headerElements = headerContainerRef.current.children;
    if (roundElements.length === 0 || headerElements.length === 0) return;

    const containerScrollLeft = scrollContainerRef.current.scrollLeft;
    const containerRect = scrollContainerRef.current.getBoundingClientRect();

    for (let i = 0; i < Math.min(numRounds, roundElements.length, headerElements.length); i++) {
      const roundEl = roundElements[i];
      const headerEl = headerElements[i];
      if (roundEl && headerEl) {
        const roundRect = roundEl.getBoundingClientRect();
        const adjustedLeft = (roundRect.left - containerRect.left) / zoom;
        const roundWidth = roundRect.width / zoom;
        headerEl.style.position = 'absolute';
        headerEl.style.left = `${adjustedLeft}px`;
        headerEl.style.width = `${roundWidth}px`;
        headerEl.style.minWidth = `${roundWidth}px`;
        headerEl.style.maxWidth = `${roundWidth}px`;
        headerEl.style.textAlign = 'center';
        headerEl.style.overflow = 'hidden';
        headerEl.style.whiteSpace = 'nowrap';
        headerEl.style.textOverflow = 'ellipsis';
        headerEl.style.transform = 'scale(1)';
        headerEl.style.transformOrigin = '0 0';
        headerEl.style.padding = '0 10px';
      }
    }
  }, [numRounds, zoom]);

  useEffect(() => {
    const timeoutId = setTimeout(() => updateHeaderAlignment(), 100);
    return () => clearTimeout(timeoutId);
  }, [zoom, loading, updateHeaderAlignment, numRounds]);

  useEffect(() => {
    const handleResize = () => setTimeout(updateHeaderAlignment, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateHeaderAlignment]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError("");

    loadCSS("https://cdn.jsdelivr.net/npm/jquery-bracket/dist/jquery.bracket.min.css");
    loadScript("https://code.jquery.com/jquery-3.6.0.min.js")
      .then(() => {
        if (typeof window !== 'undefined' && !window.jQuery) window.jQuery = window.$;
        return loadScript("https://cdn.jsdelivr.net/npm/jquery-bracket/dist/jquery.bracket.min.js");
      })
      .then(() => axiosInstance.get(`/tournament/round/${id}`))
      .then((res) => {
        if (!isMounted) return;
        const details = res.data.roundDetails?.roundUserDetils;
        if (details) buildBracket(details);
        else setError("No bracket data found.");
        setTimeout(() => {
          setupBracketAnimations(bracketRef, scrollContainerRef);
        }, 0);
        if (scrollContainerRef.current && bracketRef.current) {
          const sc = scrollContainerRef.current;
          const bc = bracketRef.current;
          console.log('[DEBUG] Scroll container:', sc);
          console.log('[DEBUG] Bracket content:', bc);
          console.log('[DEBUG] Scroll container clientHeight:', sc.clientHeight, 'scrollHeight:', sc.scrollHeight);
          console.log('[DEBUG] Bracket content offsetHeight:', bc.offsetHeight, 'scrollHeight:', bc.scrollHeight);
        }
      })
      .catch((err) => { if (isMounted) setError("Error loading bracket: " + (err.message || "Unknown error")); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => {
      isMounted = false;
      if (window.jQuery && bracketRef.current) {
        window.jQuery(bracketRef.current).empty();
        if (headerContainerRef.current) headerContainerRef.current.innerHTML = '';
      }
    };
  }, [id]);

  const updateBracketContentSize = useCallback(() => {
    if (!bracketRef.current) return;
    const width = bracketRef.current.scrollWidth;
    const height = bracketRef.current.scrollHeight;
    setContentSize({ width, height });
    if (scrollContainerRef.current) {
      const scaledWidth = width * zoomRef.current;
      const scaledHeight = height * zoomRef.current;
      scrollContainerRef.current.style.setProperty('--bracket-content-width', scaledWidth + 'px');
      scrollContainerRef.current.style.setProperty('--bracket-content-height', scaledHeight + 'px');
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateBracketContentSize();
      updateHeaderAlignment();
    }, 150);
    return () => clearTimeout(timeoutId);
  }, [loading, updateBracketContentSize, updateHeaderAlignment]);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    const container = scrollContainerRef.current;
    dragStart.current = { x: e.clientX, y: e.clientY, scrollLeft: container.scrollLeft, scrollTop: container.scrollTop };
    document.body.style.cursor = 'grabbing';
    container.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const container = scrollContainerRef.current;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > Math.abs(dy)) container.scrollLeft = dragStart.current.scrollLeft - dx;
    else container.scrollTop = dragStart.current.scrollTop - dy;
  }, []);

  const endDrag = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab';
  }, []);

  const onWheel = useCallback((e) => {
    if (!scrollContainerRef.current || !bracketRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      const container = scrollContainerRef.current;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const prevZoom = zoomRef.current;
      let newZoom = prevZoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
      newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
      if (newZoom === prevZoom) return;
      
      const contentX = (mouseX + container.scrollLeft) / prevZoom;
      const contentY = (mouseY + container.scrollTop) / prevZoom;
      const newScrollLeft = Math.max(0, contentX * newZoom - mouseX);
      const newScrollTop = Math.max(0, contentY * newZoom - mouseY);

      // Dynamic smooth factor based on zoom speed
      const zoomSpeed = Math.abs(e.deltaY);
      const dynamicSmoothFactor = Math.min(0.3, 0.05 + zoomSpeed * 0.001);
      const interpolatedZoom = prevZoom + (newZoom - prevZoom) * dynamicSmoothFactor;

      zoomRef.current = interpolatedZoom;
      setZoom(interpolatedZoom);
      requestAnimationFrame(() => {
        container.scrollLeft = newScrollLeft;
        container.scrollTop = newScrollTop;
        updateBracketContentSize();
        setTimeout(updateHeaderAlignment, 50);
      });
    }
  }, [updateBracketContentSize, updateHeaderAlignment]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateHeaderAlignment();
      const maxScrollX = container.scrollWidth - container.clientWidth;
      const maxScrollY = container.scrollHeight - container.clientHeight;
      if (maxScrollX <= 0 && maxScrollY <= 0) return;

      const scrollProgressX = container.scrollLeft / maxScrollX;
      const scrollProgressY = container.scrollTop / maxScrollY;
      const scaleRange = MAX_ZOOM - MIN_ZOOM;
      const newZoomX = MIN_ZOOM + (scrollProgressX * scaleRange);
      const newZoomY = MIN_ZOOM + (scrollProgressY * scaleRange);
      const newZoom = Math.max(newZoomX, newZoomY);

      // Smooth interpolation using lerp
      const smoothFactor = 0.1;
      const interpolatedZoom = zoomRef.current + (newZoom - zoomRef.current) * smoothFactor;

      if (Math.abs(zoomRef.current - interpolatedZoom) > 0.005) {
        zoomRef.current = interpolatedZoom;
        setZoom(interpolatedZoom);
        requestAnimationFrame(() => {
          updateBracketContentSize();
          setTimeout(updateHeaderAlignment, 50);
        });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateBracketContentSize, updateHeaderAlignment]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', endDrag);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.style.cursor = 'grab';
    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', endDrag);
      container.removeEventListener('wheel', onWheel);
      container.style.cursor = '';
      document.body.style.cursor = '';
    };
  }, [onMouseDown, onMouseMove, endDrag, onWheel]);

  function getScore(p) {
    if (!p) return null;
    if (p.status === "P") return null;
    if (p.status === "W") return p.score || 1;
    if (p.status === "D") return p.score || 0;
    if (p.status === "NA") return 1;
    return p.score || 0;
  }

  function getPreviousRoundWinners(details, roundNum) {
    if (roundNum < 1) return [];
    const round = details[roundNum];
    const winners = [];
    if (roundNum === 1) {
      round.forEach(m => winners.push(
        m.user1?.status === "W" ? m.user1 :
        m.user2?.status === "W" ? m.user2 :
        m.user1?.status === "NA" ? m.user1 :
        m.user2?.status === "NA" ? m.user2 : null
      ));
    } else {
      const prev = getPreviousRoundWinners(details, roundNum - 1);
      for (let i = 0; i < prev.length; i += 2) {
        const [p1, p2] = [prev[i], prev[i+1]];
        if (!p1 && !p2) { winners.push(null); continue; }
        if (p1 && !p2) { winners.push(p1); continue; }
        if (p2 && !p1) { winners.push(p2); continue; }
        const match = details[roundNum].find(m =>
          (m.user1?.id === p1?.id && m.user2?.id === p2?.id) ||
          (m.user1?.id === p2?.id && m.user2?.id === p1?.id)
        );
        winners.push(match?.user1?.status === "W" ? match.user1 :
                     match?.user2?.status === "W" ? match.user2 : null);
      }
    }
    return winners;
  }

  function buildBracket(details) {
    const $ = window.jQuery;
    if (headerContainerRef.current) headerContainerRef.current.innerHTML = '';
    $("#tournament").empty();

    const teams = [];
    const round1 = details["1"] || [];
    round1.forEach(m => teams.push([
      m.user1 ? { name: m.user1.username, image: m.user1.image, status: m.user1.status } : null,
      m.user2 ? { name: m.user2.username, image: m.user2.image, status: m.user2.status } : null
    ]));

    const minSize = Math.pow(2, Math.ceil(Math.log2(teams.length)));
    while (teams.length < minSize) teams.push([null,null]);

    const rounds = Object.keys(details).sort((a,b) => +a - +b);
    const results = rounds.map(rn => {
      const matches = details[rn];
      const out = [];
      if (rn === "1") {
        matches.forEach(m => out.push([getScore(m.user1), getScore(m.user2)]));
        while (out.length < minSize/2) out.push([null,null]);
      } else {
        const prevWins = getPreviousRoundWinners(details, +rn - 1);
        for (let i=0; i<prevWins.length; i+=2) {
          const [p1, p2] = [prevWins[i], prevWins[i+1]];
          const match = matches.find(m =>
            (m.user1?.id === p1?.id && m.user2?.id === p2?.id) ||
            (m.user1?.id === p2?.id && m.user2?.id === p1?.id)
          );
          if (match) out.push([getScore(match.user1), getScore(match.user2)]);
          else out.push(p1 && !p2 ? [1,null] : p2 && !p1 ? [null,1] : [null,null]);
        }
        const expected = Math.pow(2, rounds.length - (+rn));
        while (out.length < expected) out.push([null,null]);
      }
      return out;
    });

    if (headerContainerRef.current) {
      rounds.forEach((_, idx) => {
        const headerDiv = document.createElement('div');
        headerDiv.textContent = `Round ${idx + 1}`;
        headerDiv.style.fontWeight = 'bold';
        headerDiv.style.color = 'white';
        headerDiv.style.padding = '0 10px';
        headerDiv.style.display = 'flex';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.justifyContent = 'center';
        headerContainerRef.current.appendChild(headerDiv);
      });
    }

    $("#tournament").bracket({
      init: { teams, results },
      skipConsolationRound: true,
      centerConnectors: true,
      disableHighlight: true,
      disableToolbar: true,
      disableTeamEdit: true,
      disableScoreEdit: true,
      teamWidth: 140,
      scoreWidth: 50,
      matchMargin: 50,
      roundMargin: 100,
      save: () => {},
      decorator: {
        edit: () => {},
        render(c, d, s, st) {
          c.empty();
          if (d?.name && d.name.includes("(Waiting)")) {
            return c.append(`<img src="${d.image}" style="height:14px;border-radius:50%;margin-right:5px;">`)
                    .append(`<span style="color:orange">${d.name}</span>`);
          }
          if (d?.name) {
            const $w = $('<div>').css({
              display:'flex',alignItems:'center',gap:'5px',overflow:'hidden',
              whiteSpace:'nowrap',textOverflow:'ellipsis',flexGrow:1,minWidth:0
            });
            $w.append($('<img>')
              .attr('src',d.image)
              .css({height:'14px',width:'14px',borderRadius:'50%',objectFit:'cover'}))
              .append($('<span>')
                .css({color:'#fff',fontWeight:'500',fontSize:'14px',lineHeight:'14px'})
                .text(d.name)
              );
            c.append($w);
          } else {
            c.text(st === 'empty-bye' ? 'No Player' : st === 'empty-tbd' ? 'Upcoming' : '');
          }
        }
      }
    });

    setNumRounds(rounds.length);
    applyBracketTransitions();
    setTimeout(() => {
      const c = scrollContainerRef.current;
      const b = bracketRef.current;
      if (c && b) {
        c.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(updateHeaderAlignment, 200);
        console.log('[DEBUG] (buildBracket) Scroll container:', c);
        console.log('[DEBUG] (buildBracket) Bracket content:', b);
        console.log('[DEBUG] (buildBracket) Scroll container clientHeight:', c.clientHeight, 'scrollHeight:', c.scrollHeight);
        console.log('[DEBUG] (buildBracket) Bracket content offsetHeight:', b.offsetHeight, 'scrollHeight:', b.scrollHeight);
        if (window.gsap) {
          const rounds = b.querySelectorAll('.round');
          const matches = b.querySelectorAll('.match');
          console.log('[DEBUG] (buildBracket) .round count:', rounds.length, '.match count:', matches.length);
          console.log('[DEBUG] (buildBracket) .round elements:', rounds);
          console.log('[DEBUG] (buildBracket) .match elements:', matches);
        } else {
          console.log('[DEBUG] (buildBracket) window.gsap is', window.gsap);
        }
        setupBracketAnimations(bracketRef, scrollContainerRef);
      }
      if (b) {
        b.style.height = b.scrollHeight + 'px';
      }
    }, 500);
  }

  useEffect(() => {
    const handleResize = () => {
      zoomRef.current = 1;
      setZoom(1);
      if (scrollContainerRef.current && bracketRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
      updateBracketContentSize();
      setTimeout(updateHeaderAlignment, 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateBracketContentSize, updateHeaderAlignment]);

  return (
    <div style={{ maxHeight: "40vh", minHeight: "100vh", background: "#2b2b2b", color: "#fff", padding: "20px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '3px solid #fff',
            background: '#181818',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            marginRight: '10px',
            outline: 'none',
            fontSize: '1.8rem',
            color: '#fff',
            lineHeight: 1,
            fontWeight: 700,
            fontFamily: "'Inter', 'Arial', monospace",
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#374151'}
          onMouseOut={e => e.currentTarget.style.background = '#181818'}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <line x1="20" y1="14" x2="8" y2="14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <polyline points="12,10 8,14 12,18" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ display: "flex", gap: "10px" }}>
          <span>Winners</span>
          <span>Losers</span>
        </div>
      </div>

      {loading && <div style={{ textAlign: "center", marginTop: 40 }}>Loading bracket...</div>}
      {error && <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>{error}</div>}

      <div
        ref={headerContainerRef}
        id="round-headers"
        style={{
          position: "absolute",
          top: "60px",
          left: 0,
          right: 0,
          height: "30px",
          zIndex: 2,
          background: "transparent",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />

      <div style={{ height: "calc(100vh - 200px)", overflow: "auto", position: "relative" }}>
        <div
          ref={scrollContainerRef}
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            touchAction: "pan-x pan-y",
            position: "relative",
          }}
        >
          <motion.div
            animate={{ scale: zoom }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              width: contentSize.width,
              minHeight: contentSize.height,
              height: contentSize.height,
              transformOrigin: "0 0",
              willChange: "transform",
              position: "relative",
            }}
          >
            <div id="tournament" ref={bracketRef} />
          </motion.div>
        </div>
      </div>

      {/* Add Google Fonts Inter Normal and Italic */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap" rel="stylesheet" />
      <style jsx global>{`
        #tournament {
          min-height: 100%;
          height: 100%;
          position: relative;
          max-width: none;
          max-height: none;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        #tournament .team,
        #tournament .label,
        #tournament .score {
          font-family: 'Inter', Arial, sans-serif;
          font-style: italic;
        }
        #round-headers div {
          font-family: 'Inter', Arial, sans-serif !important;
          font-style: normal !important;
          font-weight: 1000 !important;
        }
        #tournament .team { background: transparent; font-size: 14px; color: white; }
        #tournament .label, #tournament .score { background: transparent; color: white; padding: 5px; font-weight: 500; }
        #tournament .connector { box-sizing: unset; border: 1px solid #b1b1b1; border-left: none; }
        #tournament .connector.top { border-top: 1px solid #b1b1b1; border-bottom: none; border-right: none; }
        #tournament .connector.bottom { border-bottom: 1px solid #b1b1b1; border-top: none; border-right: none; }
        #tournament .round { opacity: 0; }
      `}</style>
    </div>
  );
}