"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { getFirebase, serverTimestamp } from "../lib/firebase";
import { Button } from "./ui/button";
import { IconThumbDown, IconThumbUp } from "@tabler/icons-react";
import { Separator } from "./ui/separator";

type FeedbackValue = true | false;

export default function Satisfied() {
  const params = useParams();
  const noteId = useMemo(() => {
    const id = (params?.id ?? "") as string;
    return Array.isArray(id) ? id[0] : id;
  }, [params]);

  const { db } = getFirebase();

  const [alreadyAnswered, setAlreadyAnswered] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (!noteId) return;
    const ref = doc(db, "notes", noteId);
    const unsub = onSnapshot(ref, (snap) => {
      const satisfied = snap.get("satisfied");
      if (typeof satisfied === "boolean") {
        setAlreadyAnswered(true);
      }
    });
    return () => unsub();
  }, [noteId]);

  const handleFeedback = async (value: FeedbackValue) => {
    if (!noteId || submitting) return;
    setSubmitting(true);
    try {
      const ref = doc(db, "notes", noteId);
      await setDoc(
        ref,
        { satisfied: value, satisfiedAt: serverTimestamp() },
        { merge: true }
      );
      // Mark local submission to avoid unmount flicker when snapshot updates
      setHasSubmitted(true);
      // Crossfade content first, then exit container smoothly
      setShowThankYou(true);
      window.setTimeout(() => setIsExiting(true), 1400);
      window.setTimeout(() => setIsHidden(true), 1800);
    } catch (err) {
      // Optional: add toast here
      console.error("Failed to submit feedback:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!noteId) return null;
  if (isHidden) return null;
  // Hide if already answered from server, unless user just submitted now
  if (alreadyAnswered && !hasSubmitted) return null;

  return (
    <>
      <Separator className="my-12" />
      <main
        className={
          "p-8 bg-sidebar rounded-xl transition-all duration-500 ease-out " +
          (isExiting ? "scale-95 opacity-0" : "scale-100 opacity-100")
        }
      >
        <div className="grid w-full">
          <div
            className={
              "col-start-1 row-start-1 flex items-center justify-between gap-2 transition-all duration-300 ease-out " +
              (showThankYou
                ? "opacity-0 -translate-y-1 pointer-events-none"
                : "opacity-100 translate-y-0")
            }
          >
            <div className="flex gap-2 items-center">
              <h1 className="text-lg font-semibold">Happy with this note?</h1>
              <p className="text-md text-muted-foreground">Help us improve</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="like"
                size="satisfied"
                disabled={submitting}
                onClick={() => handleFeedback(true)}
              >
                <IconThumbUp className="size-8" />
              </Button>
              <Button
                variant="dislike"
                size="satisfied"
                disabled={submitting}
                onClick={() => handleFeedback(false)}
              >
                <IconThumbDown className="size-8" />
              </Button>
            </div>
          </div>

          <div
            className={
              "col-start-1 row-start-1 w-full flex items-center justify-center text-center text-sm font-medium sm:text-base transition-all duration-300 ease-out " +
              (showThankYou
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-1 pointer-events-none")
            }
          >
            Thank you for your feedback!
          </div>
        </div>
      </main>
    </>
  );
}