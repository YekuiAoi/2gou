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
			(siteContent.passwordAccessCategories || []).includes('Chara')
		
		if (needPassword) {
			// 检查是否已经验证过，并且密码没有更改
			const verified = localStorage.getItem('password_Chara') === 'verified'
			const storedHash = localStorage.getItem('password_Chara_hash')
			const currentHash = siteContent.passwordAccessPassword
			const passwordMatch = storedHash === currentHash
			
			// 只有当验证过且密码匹配时才视为已验证
			setIsVerified(verified && passwordMatch)
		} else {
			// 不需要密码验证
			setIsVerified(true)
		}
	}, [siteContent.enablePasswordAccess, siteContent.passwordAccessCategories, siteContent.passwordAccessPassword])
	
	// 筛选出分类为"人物卡"的文章
	const charaArticles = articles.filter(item => item.category === '人物卡')
	
	// 获取所有标签
	const allTags = Array.from(new Set(charaArticles.flatMap(article => article.tags || [])))
	
	// 根据搜索词和标签筛选文章
	const filteredArticles = charaArticles.filter(article => {
		const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
									(article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()))
		const matchesTag = selectedTag === 'all' || (article.tags && article.tags.includes(selectedTag))
		return matchesSearch && matchesTag
	})
	
	console.log('Total articles:', articles.length)
	console.log('charaArticles length:', charaArticles.length)
	console.log('filteredArticles length:', filteredArticles.length)
	console.log('allTags:', allTags)

	if (!isVerified) {
		return <PasswordVerify category="Chara" onVerify={() => setIsVerified(true)} />
	}

	return (
		<div className='mx-auto w-full max-w-[1920px] px-6 pt-24 pb-12'>
			<div className='mb-8 space-y-4'>
				<input
					type='text'
					placeholder='搜索人物卡...'
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
				<div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
					{filteredArticles.map((article, index) => (
						<motion.div 
							key={article.slug} 
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
							transition={{ duration: 0.3 }}
							style={{ 
								width: '200px', 
								height: '300px',
								borderRadius: '0.75rem',
								backgroundColor: 'rgba(255, 255, 255, 0.6)',
								backdropFilter: 'blur(4px)',
								flexShrink: 0,
								border: '1px solid rgba(255, 255, 255, 0.8)',
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
								overflow: 'hidden'
							}}
						>
							<Link 
								href={`/blog/${article.slug}`} 
								style={{ 
									display: 'block', 
									height: '100%', 
									textDecoration: 'none',
									position: 'relative'
								}}
								onMouseEnter={(e) => {
									const content = e.currentTarget.querySelector('.card-content');
									if (content) {
										content.style.transform = 'translateY(0)';
										content.style.opacity = '1';
									}
								}}
								onMouseLeave={(e) => {
									const content = e.currentTarget.querySelector('.card-content');
									if (content) {
										content.style.transform = 'translateY(100%)';
										content.style.opacity = '0';
									}
								}}
							>
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
										<Image
											src={article.cover}
											alt={article.title}
											width={200}
											height={300}
											style={{ 
												objectFit: 'cover', 
												width: '100%', 
												height: '100%'
											}}
										/>
									)}
								</div>
								
								{/* 卡片内容 */}
								<div className="card-content" style={{ 
									position: 'absolute',
									bottom: 0,
									left: 0,
									right: 0,
									padding: '16px',
									transition: 'transform 0.3s ease, opacity 0.3s ease',
									transform: 'translateY(100%)',
									opacity: 0,
									background: 'rgba(0, 0, 0, 0.6)',
									backdropFilter: 'blur(2px)'
								}}>
									<h2 style={{ 
										fontSize: '1rem', 
										fontWeight: '700', 
										marginBottom: '8px', 
										wordBreak: 'break-all', 
										overflow: 'hidden', 
										textOverflow: 'ellipsis', 
										whiteSpace: 'nowrap', 
										color: '#fff'
									}}>
										{article.title}
									</h2>
									
									{/* 时间 */}
									<div style={{ 
										position: 'absolute',
										bottom: '8px',
										right: '8px'
									}}>
										<div style={{ 
											fontSize: '0.75rem', 
											color: '#fff'
										}}>
											{new Date(article.date).toLocaleDateString('zh-CN')}
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>

				{filteredArticles.length === 0 && (
					<div className='mt-12 text-center text-gray-500'>
						<p>没有找到相关人物卡</p>
					</div>
				)}
			</div>
		</div>
	)
}
