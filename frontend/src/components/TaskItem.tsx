import { Dialog } from "@tritonse/tse-constellation";
import { useState } from "react";
import { Link } from "react-router-dom";
import { updateTask } from "src/api/tasks";
import { CheckButton } from "src/components";
import styles from "src/components/TaskItem.module.css";

import type { Task } from "src/api/tasks";

export type TaskItemProps = {
  task: Task;
};

export function TaskItem({ task: initialTask }: TaskItemProps) {
  const [task, setTask] = useState<Task>(initialTask);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(null);

  const handleToggleCheck = () => {
    setLoading(true);
    updateTask({
      _id: task._id,
      title: task.title,
      description: task.description,
      isChecked: !task.isChecked,
      dateCreated: task.dateCreated,
      assignee: task.assignee?._id,
    })
      .then((result) => {
        if (result.success) {
          setTask(result.data);
        } else {
          setErrorModalMessage(result.error);
        }
        setLoading(false);
      })
      .catch(setErrorModalMessage);
  };

  let textContainerClass = styles.textContainer;
  if (task.isChecked) {
    textContainerClass += ` ${styles.checked}`;
  }

  return (
    <div className={styles.item}>
      <CheckButton checked={task.isChecked} onPress={handleToggleCheck} disabled={isLoading} />
      <div className={textContainerClass}>
        <Link to={`/task/${task._id}`} className={styles.titleLink}>
          <span className={styles.title}>{task.title}</span>
        </Link>
        {task.description && <span className={styles.description}>{task.description}</span>}
      </div>
      <Dialog
        styleVersion="styled"
        variant="error"
        title="An error occurred"
        content={<p>{errorModalMessage}</p>}
        isOpen={errorModalMessage !== null}
        onClose={() => setErrorModalMessage(null)}
      />
    </div>
  );
}
