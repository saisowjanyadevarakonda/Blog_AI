import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Moment from 'moment';
import toast from 'react-hot-toast';

const UserComments = () => {
  const { axios } = useAppContext();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token from localStorage (adjust key as needed)
  const token = localStorage.getItem('token') || localStorage.getItem('uToken');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/user/get-comments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          setComments(data.comments);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [axios, token]);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg min-h-[400px]">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Your Comments</h2>
      {loading ? (
        <div className="text-gray-400 text-center py-12">Loading your comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-400 text-center py-12">You haven’t commented on any blogs yet.</div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="p-4 bg-blue-50/60 rounded-lg border border-blue-100 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">On Blog:</span>
                <span className="text-gray-700">
                  {/* If you populate blog title in backend, use comment.blog.title; else show ID */}
                  {comment.blog?.title || comment.blog || "Unknown Blog"}
                </span>
              </div>
              
              <div className="text-gray-600"><span className='font-semibold text-primary'>Comment:  </span>{comment.content}</div>
              <div className="text-xs text-gray-400 flex justify-between">
                <span>{Moment(comment.createdAt).fromNow()}</span>
                <span>{comment.isApproved ? "Approved" : "Pending Review"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserComments;
