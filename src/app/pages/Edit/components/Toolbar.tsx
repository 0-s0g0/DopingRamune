import React, { useState } from 'react';
import styles from '../styles/edit.module.css';
import { ShapeType } from '../page';

import BackgroundImage from './tools/backgroundimage';
import Addtext from './tools/addtext';
import Layor from './tools/layour';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faRectangleAd, faWindowRestore } from "@fortawesome/free-solid-svg-icons";

// モーダルコンポーネント
const Modal: React.FC<{ onClose: () => void, children: React.ReactNode }> = ({ onClose, children }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

interface ToolbarProps {
  handleBackgroundUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addText: () => void;
  addShape: (shapeType: ShapeType) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showObjectList: boolean;
  setShowObjectList: (show: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  handleBackgroundUpload,
  addText,
  addShape,
  handleImageUpload,
  showObjectList,
  setShowObjectList
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

  return (
    <div className={styles.toolbarSection}>
      {/* 背景画像アップロードモーダル */}
      <FontAwesomeIcon 
        icon={faFileImage} 
        onClick={() => openModal('backgroundImage')} 
        className={styles.icon}
      />

      {/* テキスト・シェイプ追加モーダル */}
      <FontAwesomeIcon 
        icon={faRectangleAd} 
        onClick={() => openModal('addText')} 
        className={styles.icon}
      />

      {/* レイヤーモーダル */}
      <FontAwesomeIcon 
        icon={faWindowRestore} 
        onClick={() => openModal('layor')} 
        className={styles.icon}
      />

      {/* 各モーダルの表示 */}
      {activeModal === 'backgroundImage' && (
        <Modal onClose={closeModal}>
          <BackgroundImage handleBackgroundUpload={handleBackgroundUpload} />
        </Modal>
      )}

      {activeModal === 'addText' && (
        <Modal onClose={closeModal}>
          <Addtext
            addText={addText}
            addShape={addShape}
            handleImageUpload={handleImageUpload}
          />
        </Modal>
      )}

      {activeModal === 'layor' && (
        <Modal onClose={closeModal}>
          <Layor
            showObjectList={showObjectList}
            setShowObjectList={setShowObjectList}
          />
        </Modal>
      )}
    </div>
  );
};

export default Toolbar;
