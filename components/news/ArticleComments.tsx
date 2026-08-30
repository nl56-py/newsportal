"use client";

import React, { useState } from "react";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import { toNepaliDigits } from "@/lib/nepali-utils";

interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c1",
    name: "हरि प्रसाद न्यौपाने",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&q=80",
    text: "अति सान्दर्भिक र तथ्यपरक समाचार। यस्तो सकारात्मक आर्थिक सूचकले साँच्चिकै आम नागरिक र लगानीकर्तामा आशा जगाउँछ।",
    timeAgo: "१ घण्टा अगाडि",
    likes: 14,
  },
  {
    id: "c2",
    name: "सुनिता गुरुङ",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80",
    text: "उत्पादनशील क्षेत्रमा विदेशी लगानी भित्र्याउन अझै नीतिगत स्पष्टता र छिटोछरितो सेवा प्रवाह आवश्यक छ।",
    timeAgo: "२ घण्टा अगाडि",
    likes: 8,
  },
];

export const ArticleComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [likedMap, setLikedMap] = useState<{ [key: string]: boolean }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment: Comment = {
      id: "c-" + Date.now(),
      name: name.trim() || "नेपाल पाटी पाठक",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&q=80",
      text: text.trim(),
      timeAgo: "भर्खरै",
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setText("");
    setName("");
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    setLikedMap({ ...likedMap, [id]: true });
    setComments(
      comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-8">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-200 mb-5">
        <MessageSquare className="w-5 h-5 text-brand-red" />
        <h3 className="font-mukta font-bold text-lg text-slate-900">
          प्रतिक्रियाहरू ({toNepaliDigits(comments.length)})
        </h3>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="तपाईँको नाम (ऐच्छिक)..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mukta focus:outline-none focus:border-brand-red"
          />
        </div>
        <textarea
          rows={3}
          placeholder="यस समाचारबारे आफ्नो विचार / प्रतिक्रिया लेख्नुहोस्..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm font-mukta focus:outline-none focus:border-brand-red resize-none"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-brand-red hover:bg-brand-darkred text-white text-xs sm:text-sm font-mukta font-bold flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>प्रतिक्रिया पठाउनुहोस्</span>
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4 divide-y divide-slate-200">
        {comments.map((comment) => (
          <div key={comment.id} className="pt-4 first:pt-0 flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-300 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="font-mukta font-bold text-sm text-slate-900">
                  {comment.name}
                </h5>
                <span className="text-xs text-slate-400 font-mukta">
                  {comment.timeAgo}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-mukta mt-1 leading-relaxed">
                {comment.text}
              </p>
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center space-x-1 text-xs font-mukta mt-2 transition-colors ${
                  likedMap[comment.id]
                    ? "text-brand-red font-bold"
                    : "text-slate-500 hover:text-brand-red"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>सहमत ({toNepaliDigits(comment.likes)})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
