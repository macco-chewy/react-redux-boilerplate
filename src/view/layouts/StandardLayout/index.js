import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export default (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.row1}>
          <div className={styles.logo}>Logo</div>
          <div className={styles.details}></div>
        </div>
        <ul className={styles.menu}>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/page1">Page 1</Link>
          </li>
          <li>
            <Link to="/page2">Page 2</Link>
          </li>
          <li>
            <Link to="/page3">Page 3</Link>
          </li>
        </ul>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyContents}>{props.children}</div>
      </div>
      <div className={styles.footer}></div>
    </div>
  );
};
