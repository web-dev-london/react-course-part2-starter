import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

const usePost = (userId?: number | undefined) => useQuery<Post[], Error>({
    queryKey: userId ? ['users', userId, 'posts'] : ['posts'],
    queryFn: () => axios
        .get<Post[]>('https://jsonplaceholder.typicode.com/posts', {
            params: {
                userId
            }
        })
        .then(res => res.data),
    staleTime: 1 * 60 * 1000,// 1 minute 
})


export default usePost;