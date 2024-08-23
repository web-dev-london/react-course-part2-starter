import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import { Todo } from './hooks/useTodos';
import axios from 'axios';


interface AddTodoCentext {
    previousTodos?: Todo[]
}
const TodoForm = () => {
    const queryClient = useQueryClient();
    const ref = useRef<HTMLInputElement>(null);
    const addTodo = useMutation<Todo, Error, Todo, AddTodoCentext>({
        mutationFn: async (todo: Todo) => {
            const response = await axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo);
            return response.data
        },

        onMutate: (newTodo: Todo) => {
            const previousTodos = queryClient.getQueryData<Todo[]>(['todos']) || [];

            queryClient.setQueriesData<Todo[]>(['todos'], (todos) => {
                return [newTodo, ...(todos || [])]
            });

            if (ref.current) ref.current.value = '';

            return { previousTodos };
        },

        onSuccess: (savedTodo, newTodo) => {
            queryClient.setQueriesData<Todo[]>(['todos'], (todos) => {
                return todos?.map((todo) => todo === newTodo ? savedTodo : todo)
            })
        },

        onError: (error, newTodo, context) => {
            if (!context) return;
            queryClient.setQueryData<Todo[]>(['todos'], context.previousTodos)

        }

    })

    return (
        <>
            {addTodo.error && <div className="alert alert-danger">{addTodo.error.message}</div>}
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    if (ref.current && ref.current.value)
                        addTodo.mutate({
                            id: 0,
                            title: ref.current!.value,
                            completed: false,
                            userId: 1
                        })

                    if (ref.current) ref.current.value = '';


                }}
                className="row mb-3">
                <div className="col">
                    <input ref={ref} type="text" className="form-control" />
                </div>
                <div className="col">
                    <button
                        disabled={addTodo.isLoading}
                        className="btn btn-primary"
                    >
                        {addTodo.isLoading ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default TodoForm;
