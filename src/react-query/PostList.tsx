import { useState } from 'react';
import usePost from './hooks/usePost';

const PostList = () => {
    // const [userId, setUserId] = useState<number>();
    const pageSize = 10;
    const [page, setPage] = useState(1);
    const { data: posts, error, isLoading } = usePost({ page, pageSize });


    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>{error.message}</p>;

    return (
        <>
            {/* <select
                onChange={(e) => setUserId(parseInt(e.target.value))}
                value={userId}
                className="form-select mb-3">
                <option value="">Select User</option>
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3"> User 3</option>
            </select> */}
            <ul className="list-group mb-3">
                {posts!.map((post) => (
                    <li key={post.id} className="list-group-item">
                        {post.title}
                    </li>
                ))}
            </ul>
            <button disabled={page === 1} className='btn btn-primary' onClick={() => setPage(page - 1)}>Previous</button>
            <button className='btn btn-primary ms-2' onClick={() => setPage(page + 1)}>Next</button>
        </>
    );
};

export default PostList;
