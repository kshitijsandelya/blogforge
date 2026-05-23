import { Link } from 'react-router-dom';
import { HeartIcon, EyeIcon } from '@heroicons/react/24/outline';

function getInitials(title) {
  return title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
}

export default function BlogCard({ post }) {
  const { _id, title, coverImage, author, tags, likes, views, createdAt } = post;
  const date = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <Link to={`/post/${_id}`} className="block group">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow hover:scale-[1.01] transition-transform bg-white dark:bg-gray-800">
        {coverImage ? (
          <img src={coverImage} alt={title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 flex items-center justify-center">
            <span className="text-3xl font-bold text-indigo-500 dark:text-indigo-300">{getInitials(title)}</span>
          </div>
        )}
        <div className="p-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {author?.username} &bull; {date}
          </p>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <HeartIcon className="w-4 h-4" /> {likes?.length || 0}
            </span>
            <span className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" /> {views || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
