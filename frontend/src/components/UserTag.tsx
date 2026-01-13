import styles from "src/components/UserTag.module.css";

import type { User } from "src/api/users";

export type UserTagProps = {
  user: User | null | undefined;
  className?: string;
};

export function UserTag({ user, className }: UserTagProps) {
  const containerClass = className ? `${styles.container} ${className}` : styles.container;

  if (!user) {
    return <div className={containerClass}>Not assigned</div>;
  }

  const profilePictureUrl = user.profilePictureURL || "/userDefault.svg";

  return (
    <div className={containerClass}>
      <img src={profilePictureUrl} alt={user.name} className={styles.profilePicture} />
      <span className={styles.name}>{user.name}</span>
    </div>
  );
}
