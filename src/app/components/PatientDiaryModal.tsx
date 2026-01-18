"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button1";
import { getPatientSharedEntries } from "../../../lib/actions/diary.actions";
import { formatDateTime } from "../../../lib/utils";
import { DiaryEntry } from "../../../types/appwrite.types";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";


interface PatientDiaryModalProps {
  userId: string;
  patientName: string;
}

export const PatientDiaryModal = ({ userId, patientName }: PatientDiaryModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getPatientSharedEntries(userId)
        .then((data) => {
          setEntries(data);
          setExpandedId(null); // Reset expansion on re-open
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="text-primary-500 border-primary-500 hover:bg-primary-500 hover:text-white transition-all text-xs h-8 px-2"
        >
          View Diary
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog  sm:max-w-2xl bg-white border-dark-500 text-Primary-purple max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-24-bold text-Primary-purple capitalize">
            {patientName}&apos;s Shared Diary
          </DialogTitle>
          <DialogDescription className="text-16-regular text-Primary-purple">
            Click on a title to view the entry content
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto  pr-2 mt-4 space-y-4 min-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div 
                key={entry.$id} 
                className="bg-gray-200 rounded-lg border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(entry.$id)}
                  className="w-full flex justify-between items-center p-4 bg-gradient-sky active:bg-gradient-sky/65  transition-colors text-left focus:outline-none"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-16-bold text-Primary-purple">{entry.title || "Untitled Entry"}</span>
                    <span className="text-12-regular text-gray-800">
                      {formatDateTime(entry.entry_date).dateTime}
                    </span>
                  </div>
                  {expandedId === entry.$id ? (
                    <ChevronUp className="h-5 w-5 text-primary-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-800" />
                  )}
                </button>
                
                {expandedId === entry.$id && (
                  <div className="p-4 pt-0 border-t border-dark-500 bg-dark-400/50">
                    <div className="prose prose-invert max-w-none mt-4">
                      <p className="whitespace-pre-wrap text-16-regular text-black leading-relaxed animate-in fade-in zoom-in-95 duration-200">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500 bg-dark-300 rounded-lg border border-dashed border-dark-500">
              <p>No shared diary entries found for this patient.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
