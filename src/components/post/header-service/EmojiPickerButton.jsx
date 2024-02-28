import { motion } from 'framer-motion';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { postRecipientsReactions } from '@/apis/recipients/reactionsAPI';
import Button from '@/components/common/button/Button';
import Icon from '@/components/common/icon/Icon';
import styles from '@/components/post/header-service/EmojiPickerButton.module.scss';
import { popover } from '@/utils/framerAnimation';
const EMOJI_PICKER_WIDTH = '30.7rem';
const EMOJI_PICKER_HEIGHT = '39.3rem';

const LazyEmojiPicker = lazy(() => import('emoji-picker-react'));

export default function EmojiPickerButton({
	recipientId,
	setReloadingTrigger,
}) {
	const [isPickerOpened, setIsPickerOpened] = useState(false);
	const emojiPickerRef = useRef(null);

	const handleEmojiClick = async (emojiInfo) => {
		setIsPickerOpened(false);
		await postRecipientsReactions(emojiInfo.emoji, recipientId);
		setReloadingTrigger((prevTrigger) => !prevTrigger);
	};

	const handlePickerToggle = () => {
		setIsPickerOpened(!isPickerOpened);
	};

	const handleOutsideClick = (e) => {
		if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
			setIsPickerOpened(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, []);

	return (
		<div className={styles.emojiPickerComponent} ref={emojiPickerRef}>
			<Button
				variant='outlined'
				size='md'
				icon={<Icon name='add' className={styles.addIcon} />}
				label='추가'
				labelhide={true}
				onClick={handlePickerToggle}
			/>
			<Suspense fallback={null}>
				{isPickerOpened && (
					<motion.div
						className={styles.emojiPicker}
						initial='hidden'
						animate='visible'
						variants={popover}
					>
						<LazyEmojiPicker
							onEmojiClick={handleEmojiClick}
							width={EMOJI_PICKER_WIDTH}
							height={EMOJI_PICKER_HEIGHT}
						/>
					</motion.div>
				)}
			</Suspense>
		</div>
	);
}
