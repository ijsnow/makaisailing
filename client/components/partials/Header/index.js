import React from 'react';

import styles from './styles.css';

export default function Header(props) {
  return (
    <h1 class={styles.h1}>{props.text}</h1>
  );
}
