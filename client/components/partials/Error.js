import React from 'react';
import Paper from 'material-ui/Paper';
import colors from '../../css/vars';

export default function Error(props) {
  return (
    <Paper
      style={{
        borderWidth: 1,
        borderColor: colors.errorBorder,
        backgroundColor: colors.error,
        padding: 15,
        marginTop: 20,
        marginBottom: 20,
      }}
      zDepth={1}
    >
      {props.children}
    </Paper>
  );
}
