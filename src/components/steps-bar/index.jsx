"use client";
import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <>
      <ul>
        <Link href="/que1">
          <li className="steps">Step-1</li>
        </Link>
        <Link href="/que2">
          <li className="steps">Step-2</li>
        </Link>
        <Link href="/que3">
          <li className="steps">Step-3</li>
        </Link>
        <Link href="/que4">
          <li className="steps">Step-4</li>
        </Link>
        <Link href="/que5">
          <li className="steps">Step-5</li>
        </Link>
        <Link href="/que6">
          <li className="steps">Step-6</li>
        </Link>
        <Link href="/que7">
          <li className="steps">Step-7</li>
        </Link>
        <Link href="/que8">
          <li className="steps">Step-8</li>
        </Link>
      </ul>
    </>
  );
};

export default Sidebar;
