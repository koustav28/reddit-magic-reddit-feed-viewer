import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Post from '../Post/Post';
import PostLoading from '../Post/PostLoading';
import getRandomNumber from '../../utils/getRandomNumber';
import { fetchPosts, selectFilteredPosts, setSearchTerm, fetchComments } from '../../store/redditSlice';
import './Home.css';

const Home = () => {
    const reddit = useSelector((state) => state.reddit);
    const { isLoading, error, searchTerm, selectedSubreddit } = reddit;
    const posts = useSelector(selectFilteredPosts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts(selectedSubreddit));
      }, [dispatch, selectedSubreddit]);
      
    const onToggleComments = (index) => {
        const getComments = (permalink) => {
            dispatch(fetchComments(index, permalink));
        };

        return getComments;
    };

    if(isLoading) {
        return (
            <AnimatePresence>
                {Array(getRandomNumber(3, 10)).fill().map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <PostLoading />
                    </motion.div>
                ))}
            </AnimatePresence>
        );
    }

    if(error) {
        return (
            <div className="error">
                <h2>Failed to load posts.</h2>
                <button 
                    type="button"
                    onClick={() => dispatch(fetchPosts(selectedSubreddit))}
                >
                    Try again
                </button>
            </div>
        );
    }

    if(posts.length === 0) {
        return (
            <div className="error">
                <h2>No posts matching "{searchTerm}"</h2>
                <button type="button" onClick={() => dispatch(setSearchTerm(''))}>
                    Go home
                </button>
            </div>
        );
    }

    return (
        <>
            {posts.map((post, index) => (
                <Post 
                    key={post.id}
                    post={post}
                    onToggleComments={onToggleComments(index)}
                />
            ))}
        </>
    );
};

export default Home;