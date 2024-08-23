import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CACHE_KEY_TODOS } from "../constants";

export interface Todo {
    id: number;
    title: string;
    userId: number;
    completed: boolean;
}

const useTodos = () => {
    const fetchTodos = async (): Promise<Todo[]> => {
        const response = await axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');
        return response.data
    }

    return useQuery<Todo[], Error>({
        queryKey: CACHE_KEY_TODOS,
        queryFn: fetchTodos,
        staleTime: 10 * 1000,
    })

}

export default useTodos;