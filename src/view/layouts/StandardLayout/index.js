import React from 'react';
import styles from './styles.module.css';

export default (props) => {
  return (
    <div className={styles.root}>
      <div>header</div>
      <div>{props.children}</div>
      <div>footer</div>
    </div>
  );
};
