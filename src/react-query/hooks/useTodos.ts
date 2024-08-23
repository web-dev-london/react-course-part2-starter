import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
        queryKey: ['todos'],
        queryFn: fetchTodos,
        staleTime: 10 * 1000,
    })

}

export default useTodos;