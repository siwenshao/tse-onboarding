import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTask } from "src/api/tasks";
import { Page, Button, TaskForm, UserTag } from "src/components";
import styles from "src/pages/TaskDetail.module.css";

import type { Task } from "src/api/tasks";

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("Task ID not found in URL");
      setLoading(false);
      return;
    }

    void (async () => {
      const result = await getTask(id);
      if (result.success) {
        setTask(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    })();
  }, [id]);

  return (
    <Page>
      <title>{task ? `${task.title} | TSE Todos` : "Task Detail | TSE Todos"}</title>
      <div className={styles.container}>
        <Link to="/" className={styles.backLink}>
          ← Back to tasks
        </Link>

        {isLoading && <p className={styles.message}>Loading...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        {task === null && !isLoading && <p className={styles.message}>No task found</p>}

        {task && (
          <>
            {isEditing ? (
              <TaskForm
                mode="edit"
                task={task}
                onSubmit={(updatedTask) => {
                  setTask(updatedTask);
                  setIsEditing(false);
                }}
              />
            ) : (
              <div className={styles.taskDetail}>
                <div className={styles.header}>
                  <h1 className={styles.title}>{task.title}</h1>
                  <Button label="Edit task" onClick={() => setIsEditing(true)} />
                </div>

                {task.description && <p className={styles.description}>{task.description}</p>}

                <div className={styles.metadata}>
                  <div className={styles.metadataItem}>
                    <strong>Assignee</strong>
                    <UserTag user={task.assignee} />
                  </div>

                  <div className={styles.metadataItem}>
                    <strong>Status</strong>
                    <p>{task.isChecked ? "Done" : "Not done"}</p>
                  </div>

                  <div className={styles.metadataItem}>
                    <strong>Date created</strong>
                    <p>{task.dateCreated.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  );
}
