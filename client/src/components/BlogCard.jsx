import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id, visibility } = blog;
  const navigate = useNavigate();
  const {user} = useAppContext();
  // console.log(user)
  // console.log(user.isSubscribed);
  const token = localStorage.getItem('token');
  const uToken = localStorage.getItem('uToken');
  const isSubscribed = user?.isSubscribed && (!user.subscriptionExpiry || new Date(user.subscriptionExpiry) > new Date());
  
  const handleClick = () => {
    if(visibility === 'private' && !token  ){
      if(!user || !isSubscribed){
        toast.error('you must subscribe to view this blog');
        return;
      }
    }
    navigate(`/blog/${_id}`);
  }
  const [lock,setLock] = useState(true);
  
  useEffect(() => {
     if(user && isSubscribed){
      setLock(false);
     }
  },[user]);

  return (
    <div
      onClick={handleClick }
      className='w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer relative'
    >
      <img src={image} alt='' className='aspect-video' />
      
      {/* Flex row: category left, lock icon right */}
      <div className="flex items-center justify-between px-5 mt-4">
        <span className='px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs'>
          {category}
        </span>
        {visibility === 'private' && lock && (
          <img
            src={assets.lock_icon}
            alt='private'
            className='w-6 h-6 z-10'
            title='Private blog'
          />
        )}
        {
          visibility === 'private' && !lock  && (
            <img
            src={assets.unlock_icon}
            alt='publicForSubs'
            className='w-6 h-6 z-10'
            
            />
          )
        } 
         
        

      </div>
      
      <div className='p-5'>
        <h5 className='mb-2 font-medium text-gray-900'>{title}</h5>
        <p
          className='mb-3 text-xs text-gray-600'
          dangerouslySetInnerHTML={{ "__html": description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  )
}

export default BlogCard
