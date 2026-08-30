import React from "react";
import { Author } from "@/lib/types";
import { Mail, Twitter } from "lucide-react";

interface AuthorBioProps {
  author: Author;
}

export const AuthorBio: React.FC<AuthorBioProps> = ({ author }) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6 flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
      {/* Author Avatar */}
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-red flex-shrink-0 bg-slate-200 shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar}
          alt={author.name}
          width={120}
          height={120}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Author Details */}
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h4 className="font-mukta font-bold text-lg text-slate-900">
              {author.name}
            </h4>
            <p className="text-xs text-brand-red font-medium font-mukta">
              {author.role}
            </p>
          </div>

          {/* Social / Email Links */}
          <div className="flex items-center justify-center sm:justify-end space-x-2 text-slate-500">
            {author.email && (
              <a
                href={`mailto:${author.email}`}
                className="p-1 rounded hover:text-brand-red transition-colors"
                title="Email Author"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {author.socials?.twitter && (
              <a
                href={`https://twitter.com/${author.socials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded hover:text-black transition-colors"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {author.bio && (
          <p className="text-xs text-slate-600 font-mukta mt-2 leading-relaxed">
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );
};
