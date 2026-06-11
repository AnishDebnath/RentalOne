import React from 'react';
import { ExternalLink, Facebook, Instagram, Youtube } from 'lucide-react';

type UserSocialConnectionsProps = {
  user: any;
};

const UserSocialConnections = ({ user }: UserSocialConnectionsProps) => {
  return (
    <section className="bg-white rounded-[1rem] border border-line shadow-sm p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
        <ExternalLink className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-ink">Social Connections</h2>
      </div>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {/* Facebook */}
        <div className="rounded-card border border-line bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </div>
          {user.facebook ? (
            <a
              href={user.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-medium text-primary hover:underline"
            >
              {user.facebook}
            </a>
          ) : (
            <p className="text-sm font-medium text-muted">Not provided</p>
          )}
        </div>

        {/* Instagram */}
        <div className="rounded-card border border-line bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
            <Instagram className="h-4 w-4 text-pink-600" />
            Instagram
          </div>
          {user.instagram ? (
            <a
              href={user.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-medium text-primary hover:underline"
            >
              {user.instagram}
            </a>
          ) : (
            <p className="text-sm font-medium text-muted">Not provided</p>
          )}
        </div>

        {/* YouTube */}
        <div className="rounded-card border border-line bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
            <Youtube className="h-4 w-4 text-red-600" />
            YouTube
          </div>
          {user.youtube ? (
            <a
              href={user.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm font-medium text-primary hover:underline"
            >
              {user.youtube}
            </a>
          ) : (
            <p className="text-sm font-medium text-muted">Not provided</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserSocialConnections;
