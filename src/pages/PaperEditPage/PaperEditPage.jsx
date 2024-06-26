import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deletePaper, deleteMessage } from "../../services/api";
import MyPaperCardList from "../MyPaperPage/components/MyPaperCardList";
import styles from "./PaperEditPage.module.scss";
import PrimaryButton from "../../components/UI/PrimaryButton";
import MyPageHeader from "../MyPaperPage/myPageHeader/MyPageHeader";
import useBreakPoint from "../../hooks/useBreakPoint";
import FadeInOut from "../../components/animation/FadeInOut";

function PaperEditPage() {
  const [sendersToDelete, setSendersToDelete] = useState(new Set()); // 삭제할 메시지 id값들을 담은 집합
  const [isDeleteActive, setIsDeleteActive] = useState(false);
  const { id } = useParams();
  const { isMobile } = useBreakPoint(); // 1920px 이하
  const navigate = useNavigate();

  // 롤링페이퍼 삭제
  const handleDeletePaper = async () => {
    if (window.confirm("롤링페이퍼가 삭제됩니다.")) {
      await deletePaper(id);
      navigate("/list");
    }
  };

  // 메시지카드 삭제
  const handleDeleteMessage = async (senderIds) => {
    // senderIds : 삭제할 메시지의 id값들이 담긴 집합
    if (window.confirm("저장하시겠습니까?")) {
      await deleteMessage(senderIds); // DELETE Request
      navigate(`/post/${id}`);
    } else {
      window.location.reload();
    }
  };

  // 삭제할 메시지카드의 ID값들 저장
  const handleSetDeleteMessage = (senderId) => {
    setIsDeleteActive(true);
    setSendersToDelete(
      (existingSenders) => new Set([...existingSenders, senderId])
    );
  };

  return (
    <FadeInOut>
      <MyPageHeader />
      <div className={styles.container}>
        <div className={styles.controlButtons}>
          {!isMobile && (
            <PrimaryButton
              size={isMobile ? "md" : "sm"}
              onClick={handleDeletePaper}
              warning={true}
            >
              삭제하기
            </PrimaryButton>
          )}

          <PrimaryButton
            WidthMax={true}
            size={isMobile ? "md" : "sm"}
            disable={!isDeleteActive}
            onClick={() => handleDeleteMessage(sendersToDelete)}
          >
            저장
          </PrimaryButton>
          {!isMobile && (
            <PrimaryButton
              size={isMobile ? "md" : "sm"}
              onClick={() => navigate(`/post/${id}`)}
            >
              돌아가기
            </PrimaryButton>
          )}
        </div>

        <MyPaperCardList
          id={id}
          isAddMessagePossible={false}
          deleteMessage={handleSetDeleteMessage}
        />
      </div>
    </FadeInOut>
  );
}
export default PaperEditPage;
