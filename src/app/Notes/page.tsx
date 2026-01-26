'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import Image from 'next/image'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { useState, useEffect } from 'react'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { PasswordVerify } from '@/components/password-verify'

export default function Page() {
	const { siteContent } = useConfigStore()
	const { items: articles, loading } = useBlogIndex()
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedTag, setSelectedTag] = useState<string>('all')
	const [isVerified, setIsVerified] = useState(false)
	
	// 检查是否需要密码验证
	useEffect(() => {
		const needPassword = siteContent.enablePasswordAccess && 
			siteContent.passwordAccessPassword && 
			(siteContent.passwordAccessCategories || []).includes('Notes')
		
		if (needPassword) {
			// 检查是否已经验证过，并且密码没有更改
			const verified = localStorage.getItem('password_Notes') === 'verified'
			const storedHash = localStorage.getItem('password_Notes_hash')
			const currentHash = siteContent.passwordAccessPassword
			const passwordMatch = storedHash === currentHash
			
			// 只有当验证过且密码匹配时才视为已验证
			setIsVerified(verified && passwordMatch)
		} else {
			// 不需要密码验证
			setIsVerified(true)
		}
	}, [siteContent.enablePasswordAccess, siteContent.passwordAccessCategories, siteContent.passwordAccessPassword])
	
	// 筛选出分类为"笔记"的文章
	const notesArticles = articles.filter(item => item.category === '笔记')
	
	// 获取所有标签
	const allTags = Array.from(new Set(notesArticles.flatMap(article => article.tags || [])))
	
	// 根据搜索词和标签筛选文章
	const filteredArticles = notesArticles.filter(article => {
		const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
									(article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()))
		const matchesTag = selectedTag === 'all' || (article.tags && article.tags.includes(selectedTag))
		return matchesSearch && matchesTag
	})
	
	console.log('Total articles:', articles.length)
	console.log('notesArticles length:', notesArticles.length)
	console.log('filteredArticles length:', filteredArticles.length)
	console.log('allTags:', allTags)

	// 截断文本函数
	const truncateText = (text, maxLength) => {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + '...';
	};

	if (!isVerified) {
		return <PasswordVerify category="Notes" onVerify={() => setIsVerified(true)} />
	}

	return (
		<div className='mx-auto w-full max-w-[1920px] px-6 pt-24 pb-12'>
			<div className='mb-8 space-y-4'>
				<input
					type='text'
					placeholder='搜索笔记...'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					className='focus:ring-brand mx-auto block w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
				/>

				<div className='flex flex-wrap justify-center gap-2'>
					<button
						onClick={() => setSelectedTag('all')}
						className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
							selectedTag === 'all' ? 'bg-brand text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
						}`}>
						全部
					</button>
					{allTags.map(tag => (
						<button
							key={tag}
							onClick={() => setSelectedTag(tag)}
							className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
								selectedTag === tag ? 'bg-brand text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
							}`}>
							{tag}
						</button>
					))}
				</div>
			</div>

			<div style={{ width: '100%', maxWidth: '1920px', margin: '0 auto', padding: '0 20px' }}>
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
					{filteredArticles.map((article, index) => (
						<motion.div 
							key={article.slug} 
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
							transition={{ duration: 0.3 }}
							style={{ 
								width: '250px', 
								height: '250px', // 1:1 正方形
								borderRadius: '0.75rem',
								backgroundColor: 'rgba(255, 255, 255, 0.6)',
								backdropFilter: 'blur(4px)',
								flexShrink: 0,
								border: '1px solid rgba(255, 255, 255, 0.8)',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
								overflow: 'hidden',
								position: 'relative'
							}}
						>
							<Link href={`/blog/${article.slug}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
								{/* 封面图片 */}
								<div style={{ 
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%', 
									height: '100%', 
									overflow: 'hidden'
								}}>
									{article.cover && (
										<img
							src={article.cover}
							alt={article.title}
							style={{ 
								objectFit: 'contain', 
								width: '100%', 
								height: '100%'
							}}
						/>
									)}
								</div>
								
								{/* 卡片内容 - 透明背景，层级在封面之上 */}
								<div style={{ 
									position: 'absolute',
									bottom: 0,
									left: 0,
									right: 0,
									padding: '16px',
									transition: 'transform 0.3s ease, opacity 0.3s ease',
									transform: 'translateY(0)',
									opacity: 1,
									background: 'linear-gradient(transparent, rgba(255, 255, 255, 0.8))'
								}}
									className='group-hover:transform group-hover:translate-y-full group-hover:opacity-0'>
									<h3 style={{ 
										fontSize: '1rem', 
										fontWeight: '700', 
										marginBottom: '8px', 
										wordBreak: 'break-all', 
										overflow: 'hidden', 
										textOverflow: 'ellipsis', 
										whiteSpace: 'nowrap', 
										color: '#000'
									}}>
										{article.title}
									</h3>
									
									{/* 标签 */}
									{article.tags && article.tags.length > 0 && (
										<div style={{ 
											display: 'flex', 
											flexWrap: 'wrap', 
											gap: '4px'
										}}>
											{article.tags.slice(0, 3).map((tag, tagIndex) => (
												<span key={tagIndex} style={{ 
													fontSize: '0.7rem', 
													color: '#fff', 
													backgroundColor: 'rgba(0, 0, 0, 0.6)', 
													padding: '2px 8px', 
													borderRadius: '12px',
													backdropFilter: 'blur(2px)'
												}}>
													{tag}
												</span>
											))}
											{article.tags.length > 3 && (
												<span style={{ 
													fontSize: '0.7rem', 
													color: '#fff',
													backgroundColor: 'rgba(0, 0, 0, 0.6)',
													padding: '2px 8px',
													borderRadius: '12px',
													backdropFilter: 'blur(2px)'
												}}>
													+{article.tags.length - 3}
												</span>
											)}
										</div>
									)}
								</div>
							</Link>
						</motion.div>
					))}
				</div>

				{filteredArticles.length === 0 && (
					<div className='mt-12 text-center text-gray-500'>
						<p>没有找到相关笔记</p>
					</div>
				)}
			</div>
		</div>
	)
}
