import { useNavigate } from 'react-router';
import { Note } from '@/types/channel';
import { useCalm } from '@/state/settings';
import getHanDataFromEssay from '@/logic/getHanData';
import DiaryNoteHeadline from '../DiaryNoteHeadline';

interface DiaryGridItemProps {
  note: Note;
  time: bigInt.BigInteger;
}

export default function DiaryGridItem({ note, time }: DiaryGridItemProps) {
  const navigate = useNavigate();
  const calm = useCalm();

  const { essay } = note;
  const { image } = getHanDataFromEssay(essay);
  const hasImage = image?.length !== 0;
  const { quipCount, lastQuippers } = note.seal.meta;

  return (
    <div
      role="link"
      tabIndex={0}
      className={
        'flex w-full cursor-pointer flex-col space-y-8 rounded-xl bg-white bg-cover bg-center p-8'
      }
      style={
        hasImage && !calm?.disableRemoteContent
          ? {
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.33), rgba(0, 0, 0, 0.33)), url(${image})`,
              color: '#ffffff',
            }
          : undefined
      }
      onClick={() => navigate(`note/${time.toString()}`)}
    >
      <DiaryNoteHeadline
        lastQuippers={lastQuippers}
        quipCount={quipCount}
        essay={essay}
        time={time}
        isInGrid
      />
    </div>
  );
}
