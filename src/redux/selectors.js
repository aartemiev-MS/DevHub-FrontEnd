export const getTodosState = store => store.todos;

export const getTodoList = store =>
    getTodosState(store) ? getTodosState(store).allIds : []