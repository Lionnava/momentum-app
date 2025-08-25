// Busca la línea donde defines el componente TaskListItem o similar
// Y añade tipos explícitos para las props.
const TaskListItem = ({ task }: { task: Task }) => { // En lugar de (task) a secas
  // ...
}

// En el JSX, cuando haces el map
tasks.map(task => (
  // Si 'task' sigue dando error de 'any', puedes castearlo explícitamente
  <TaskListItem key={task.id} task={task as Task} />
))