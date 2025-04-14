"use client";

import { RHFTextInput } from "@/components/hook-form";
import {
    disputesListAction,
    trackerListAction,
} from "@/redux/dashboard/action";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import moment from "moment";
import { getData } from "@/utils/storage";
import Loader from "@/components/Loader";





const styles = {
    innerStyle: {
        alignSelf: 'center',
        flexDirection: 'row',
        verticalAlign: 'middle',
        marginTop: '1%',
        padding: '2%',
        width: '95%',
        display: 'flex',
        alignItems: 'center',
    },


    nameStyle: {
        justifyContent: 'center',
        paddingLeft: '3%',
        width: '60%',
    },
    divisionStyle: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingLeft: '3%',
        width: '20%',
    },

 
    statHead: { marginBottom: 7, display: 'block' },
    statText: { marginBottom: 7, color: '#e6d500', display: 'block' },

    menuIcon: {
        position: "absolute",
        top: "-2%",
        right: "-2%"
      },
};


const Tracker = () => {

    const [matchedPlayed, setMatchedPlayed] = useState(0)
    const [matchesWon, setMatchesWon] = useState(0)
    const [winRate, setWinRate] = useState(0)
    const [ratingPoints, setRatingPoints] = useState(0)
    const [currentDivision, setCurrentDivision] = useState("")
    const [nextDivisionCriteria, setNextDivisionCriteria] = useState(null)

    const dispatch = useDispatch();
    const [isLoader, setIsLoader] = useState(false); // Initialize with null or some default value
    const user = getData("user");

    useEffect(() => {
        getMatchHistoryList();
    }, []);

    const getMatchHistoryList = async () => {
        setIsLoader(true);
        const payload = new FormData();
        payload.append("user_id", user.data.id);
        payload.append("game_id", user?.roomDetails?.id);

        try {
            const res = await dispatch(trackerListAction(payload));

            setIsLoader(false);

            if (res.payload.status) {
                console.log("Data: ", res.payload.data);

                setMatchedPlayed(res.payload.data.matchedPlayed)
                setMatchesWon(res.payload.data.matchesWon);
                setWinRate(res.payload.data.winRate);
                setRatingPoints(res.payload.data.ratingPoints);
                setCurrentDivision(res.payload.data.currentDivision);
                setNextDivisionCriteria(res.payload.data.nextDivisionCriteria);
            }
        } catch (error) {
            setIsLoader(false);
        }
    };
    return (
        <>
            {isLoader ? (
                <Loader />
            ) : (
                <div className="bg-black06 min-h-screen p-4">
                    <h1 className="text-white text-2xl font-semibold mb-4">
                        Tracker
                    </h1>
                    <div className="space-y-4">
                        <div style={{ width: '100%' }}>
                            <div style={styles.innerStyle}>
                                <div className="imageStyle">
                                    <Image
                                        className="rounded-full avator-img" width={100} height={100}
                                        src={
                                            user?.data.image.startsWith("http") ||
                                                user?.data.image.startsWith("/")
                                                ? user.data.image
                                                : `/images/logo.png` // Fallback for invalid image paths
                                        }
                                    ></Image>
                                </div>
                                <div style={styles.nameStyle}>
                                    <span className="text-lg text-white">
                                        {user?.data ? user.data.username : ''}
                                    </span>
                                </div>
                                <div style={styles.divisionStyle}>
                                    <span className="text-lg text-white">{currentDivision}</span>
                                </div>
                            </div>


                            <div style={{ marginBottom: 9 }}>
                                <span className="text-xl text-white" style={{ textAlign: 'center' }}>Progress</span>
                            </div>


                            <div className="statsStyle">
                                <div className="statBox">
                                    <span className="text-sm text-white" style={styles.statHead}>MP</span>
                                    <span className="text-xl" style={styles.statText}>{matchedPlayed}</span>
                                </div>
                                <div className="statBox">
                                    <span className="text-sm text-white" style={styles.statHead}>Wins</span>
                                    <span className="text-xl" style={styles.statText}>{matchesWon}</span>
                                </div>
                                <div className="statBox">
                                    <span className="text-sm text-white" style={styles.statHead}>WR</span>
                                    <span className="text-xl" style={styles.statText}>{winRate.toFixed(0)}%</span>
                                </div>
                                <div className="statBox">
                                    <span className="text-sm text-white" style={styles.statHead}>RP</span>
                                    <span className="text-xl" style={styles.statText}>{ratingPoints}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: 9, marginTop: 15, }}>
                                <span className="text-xl text-white" style={{ textAlign: 'center' }}>{nextDivisionCriteria ? nextDivisionCriteria.nextDivision : '...'}</span>
                            </div>

                            <div className="statsStyle">
                                <div className="statBox">
                                    {nextDivisionCriteria ?
                                        nextDivisionCriteria.criteria.matchesPlayed.met ?
                                            <Image src="/images/tick.png" width={30} height={30} style={styles.menuIcon} /> :
                                            <Image src="/images/cross.png" width={30} height={30} style={styles.menuIcon} />
                                        : ""}
                                    <span className="text-sm text-white" style={styles.statHead}>MP</span>
                                    <span className="text-xl" style={styles.statText}>{nextDivisionCriteria ? nextDivisionCriteria.criteria.matchesPlayed.required : '...'}</span>
                                </div>

                                <div className="statBox">
                                    {nextDivisionCriteria ?
                                        nextDivisionCriteria.criteria.winRate.met ?
                                            <Image src="/images/tick.png" width={30} height={30} style={styles.menuIcon} /> :
                                            <Image src="/images/cross.png" width={30} height={30} style={styles.menuIcon} />
                                        : ""}
                                    <span className="text-sm text-white" style={styles.statHead}>Wins</span>
                                    <span className="text-xl" style={styles.statText}>{nextDivisionCriteria ? ((nextDivisionCriteria.criteria.winRate.required / 100) * matchedPlayed).toFixed(0) : '...'}</span>
                                </div>


                                <div className="statBox">
                                    {nextDivisionCriteria ?
                                        nextDivisionCriteria.criteria.winRate.met ?
                                            <Image src="/images/tick.png" width={30} height={30} style={styles.menuIcon} /> :
                                            <Image src="/images/cross.png" width={30} height={30} style={styles.menuIcon} />
                                        : ""}
                                    <span className="text-sm text-white" style={styles.statHead}>WR</span>
                                    <span className="text-xl" style={styles.statText}>{nextDivisionCriteria ? nextDivisionCriteria.criteria.winRate.required : '...'}</span>
                                </div>

                                <div className="statBox">
                                    {nextDivisionCriteria ?
                                        nextDivisionCriteria.criteria.ratingPoints.met ?
                                            <Image src="/images/tick.png" width={30} height={30} style={styles.menuIcon} /> :
                                            <Image src="/images/cross.png" width={30} height={30} style={styles.menuIcon} />
                                        : ""}
                                    <span className="text-sm text-white" style={styles.statHead}>RP</span>
                                    <span className="text-xl" style={styles.statText}>{nextDivisionCriteria ? nextDivisionCriteria.criteria.ratingPoints.required : '...'}</span>
                                </div>
                            </div>



                            <div style={{ marginBottom: 9, marginTop: 25 }}>
                                <span className="text-xl text-white" style={{ textAlign: 'center' }}>Next Steps</span>
                            </div>

                            <div>
                            {nextDivisionCriteria ?
                            nextDivisionCriteria.criteria.matchesPlayed.met ?
                            <></> : <p className="text-sm text-white" style={{marginBottom: 8}}>Play {nextDivisionCriteria.criteria.matchesPlayed.required - nextDivisionCriteria.criteria.matchesPlayed.actual} more matches to reach the matches played requirement.</p> 
                            : ""}


                        {nextDivisionCriteria ?
                            nextDivisionCriteria.criteria.winRate.met ?
                                <></> :
                                <p className="text-sm text-white" style={{marginBottom: 8}}>Win {((nextDivisionCriteria.criteria.winRate.required / 100) * matchedPlayed).toFixed(0) - matchesWon} more matches to reach win rate requirement.</p>
                            : ""}


                    

                        {nextDivisionCriteria ?
                            nextDivisionCriteria.criteria.ratingPoints.met ?
                                <></> :
                                <p className="text-sm text-white" style={{marginBottom: 8}}>Play higher ranking opponents to boost your ranking.</p>
                            : ""}
                            </div>


                            








                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Tracker;
