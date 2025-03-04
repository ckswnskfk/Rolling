import '@/assets/globals.scss';

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { getMessageList, getRecipientInfo } from '@/apis/post/postAPI';
import { getRecipientList } from '@/apis/recipients/recipientsAPI';
import { ModalProvider } from '@/contexts/ModalContext';
import HomePage from '@/pages/home/HomePage';
import ListPage from '@/pages/list/ListPage';
import PostIdPage from '@/pages/post/PostIdPage';
import PostPage from '@/pages/post/PostPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: '/list',
		element: <ListPage />,
		loader: async () => {
			const [
				{ results: popularRecipientList },
				{ results: recentRecipientList },
			] = await Promise.all([
				getRecipientList({ limit: 12, sort: 'like' }),
				getRecipientList({ limit: 12 }),
			]);

			return { popularRecipientList, recentRecipientList };
		},
	},
	{
		path: '/post/:recipientId',
		element: <PostIdPage />,
		loader: async ({ params }) => {
			const [{ messageListInfo }, recipientInfo] = await Promise.all([
				getMessageList({
					recipientId: params.recipientId,
					limit: 15,
				}),
				getRecipientInfo(params.recipientId),
			]);

			return {
				recipientId: params.recipientId,
				messageListInfo,
				recipientInfo,
			};
		},
	},
	{
		path: '/post',
		element: <PostPage />,
	},
	{
		path: '/post/:recipientId/message',
		Component: lazy(() => import('@/pages/PostIdMessage/PostMessage')),
		// async lazy() {
		// 	let PostMessage = await import('@/pages/PostIdMessage/PostMessage');
		// 	console.log(PostMessage);
		// 	return {
		// 		Component: PostMessage,
		// 	};
		// },
	},

	{
		path: '/post/:recipientId/edit',
		element: <PostIdPage />,
		loader: async ({ params }) => {
			const [{ messageListInfo }, recipientInfo] = await Promise.all([
				getMessageList({
					recipientId: params.recipientId,
					limit: 15,
				}),
				getRecipientInfo(params.recipientId),
			]);

			return {
				recipientId: params.recipientId,
				messageListInfo,
				recipientInfo,
			};
		},
	},
]);

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ModalProvider>
			<Suspense fallback={null}>
				<RouterProvider router={router} />
			</Suspense>
		</ModalProvider>
	</React.StrictMode>,
);
