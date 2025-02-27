import React from 'react';
import styles from './../../styles/edit.module.css';

interface LayorProps {
  showObjectList: boolean;
  setShowObjectList: (show: boolean) => void;
}

const Layor: React.FC<LayorProps> = ({
  showObjectList,
  setShowObjectList
}) => {
  return (
      <div className={styles.toolGroup}>
        <h3>レイヤー管理</h3>
        <button onClick={() => setShowObjectList(!showObjectList)}>
          {showObjectList ? 'オブジェクト一覧を隠す' : 'オブジェクト一覧を表示'}
        </button>
      </div>
  );
};

export default Layor;