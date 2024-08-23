import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Todo } from './useTodos';
import { CACHE_KEY_TODOS } from '../constants';



export interface AddTodoCentext {
    previousTodos?: Todo[]
}

const useAddTodo = (onAdd: () => void) => {
    const queryClient = useQueryClient();
    return useMutation<Todo, Error, Todo, AddTodoCentext>({
        mutationFn: async (todo: Todo) => {
            const response = await axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo);
            return response.data
        },

        onMutate: (newTodo: Todo) => {
            const previousTodos = queryClient.getQueryData<Todo[]>(CACHE_KEY_TODOS) || [];

            queryClient.setQueriesData<Todo[]>(CACHE_KEY_TODOS, (todos = []) => {
                return [newTodo, ...todos]
            });

            onAdd();

            return { previousTodos };
        },

        onSuccess: (savedTodo, newTodo) => {
            queryClient.setQueriesData<Todo[]>(CACHE_KEY_TODOS, (todos) => {
                return todos?.map((todo) => todo === newTodo ? savedTodo : todo)
            })
        },

        onError: (error, newTodo, context) => {
            if (!context) return;
            queryClient.setQueryData<Todo[]>(CACHE_KEY_TODOS, context.previousTodos)

        }

    })

}

export default useAddTodo