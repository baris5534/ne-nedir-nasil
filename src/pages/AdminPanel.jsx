import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import MDEditor from '@uiw/react-md-editor';
import PostList from '../components/PostList';
import CategoryManager from '../components/CategoryManager';
import CodeExampleManager from '../components/CodeExampleManager';

export default function AdminPanel() {
	const [activeTab, setActiveTab] = useState('posts');
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newPost, setNewPost] = useState({
		title: '',
		content: ''
	});
	const [title, setTitle] = useState('');
	const [blocks, setBlocks] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);

	// Yazıları getir
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'posts'));
				const postsData = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				})).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
				
				setPosts(postsData);
			} catch (error) {
				console.error('Yazılar yüklenirken hata:', error);
				alert('Yazılar yüklenirken bir hata oluştu');
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	// Kategorileri getir
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'categories'));
				const categoriesData = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data()
				}));
				setCategories(categoriesData);
			} catch (error) {
				console.error('Kategoriler yüklenirken hata:', error);
			}
		};

		fetchCategories();
	}, []);

	// Yazı silme
	const handleDelete = async (postId) => {
		if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
			try {
				await deleteDoc(doc(db, 'posts', postId));
				setPosts(posts.filter(post => post.id !== postId));
				alert('Yazı başarıyla silindi');
			} catch (error) {
				console.error('Silme hatası:', error);
				alert('Yazı silinirken bir hata oluştu');
			}
		}
	};

	// Blok ekleme fonksiyonları
	const addTextBlock = () => {
		setBlocks([...blocks, { type: 'text', content: '' }]);
	};

	const addCodeBlock = () => {
		setBlocks([...blocks, { type: 'code', code: '', codeTitle: '' }]);
	};

	// Blok güncelleme
	const updateBlock = (index, field, value) => {
		const newBlocks = [...blocks];
		newBlocks[index] = { ...newBlocks[index], [field]: value };
		setBlocks(newBlocks);
	};

	// Blok silme
	const removeBlock = (index) => {
		setBlocks(blocks.filter((_, i) => i !== index));
	};

	// Form gönderme
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title.trim()) {
			alert('Lütfen bir başlık girin');
			return;
		}

		if (blocks.length === 0) {
			alert('En az bir içerik bloğu ekleyin');
			return;
		}

		try {
			const postData = {
				title: title.trim(),
				blocks: blocks,
				categories: selectedCategories,
				createdAt: serverTimestamp()
			};

			await addDoc(collection(db, 'posts'), postData);
			
			// Formu temizle
			setTitle('');
			setBlocks([]);
			setSelectedCategories([]);
			
			alert('Yazı başarıyla eklendi');
		} catch (error) {
			console.error('Ekleme hatası:', error);
			alert('Yazı eklenirken bir hata oluştu');
		}
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case 'posts':
				return (
					<>
						{/* Yeni yazı ekleme */}
						<div className="bg-gray-800 p-6 rounded-lg">
							<h2 className="text-2xl font-bold mb-6">Yeni Yazı Ekle</h2>
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Başlık */}
								<div>
									<label className="block text-sm font-medium mb-2">Başlık</label>
									<input
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="w-full p-2 bg-gray-700 rounded"
										placeholder="Yazı başlığı"
									/>
								</div>

								{/* Kategoriler */}
								<div>
									<label className="block text-sm font-medium mb-2">Kategoriler</label>
									<div className="flex flex-wrap gap-2">
										{categories.map(category => (
											<button
												key={category.id}
												type="button"
												onClick={() => {
													if (selectedCategories.includes(category.name)) {
														setSelectedCategories(selectedCategories.filter(c => c !== category.name));
													} else {
														setSelectedCategories([...selectedCategories, category.name]);
													}
												}}
												className={`px-3 py-1 rounded-full text-sm ${
													selectedCategories.includes(category.name)
														? 'bg-blue-500 text-white'
														: 'bg-gray-700 text-gray-300'
												}`}
											>
												{category.name}
											</button>
										))}
									</div>
								</div>

								{/* İçerik Blokları */}
								<div className="space-y-4">
									{blocks.map((block, index) => (
										<div key={index} className="bg-gray-800 p-4 rounded-lg">
											{block.type === 'text' ? (
												<MDEditor
													value={block.content}
													onChange={(value) => updateBlock(index, 'content', value)}
													preview="edit"
												/>
											) : (
												<div className="space-y-2">
													<input
														type="text"
														value={block.codeTitle}
														onChange={(e) => updateBlock(index, 'codeTitle', e.target.value)}
														className="w-full p-2 bg-gray-700 rounded"
														placeholder="Kod başlığı"
													/>
													<textarea
														value={block.code}
														onChange={(e) => updateBlock(index, 'code', e.target.value)}
														className="w-full p-2 bg-gray-700 rounded font-mono"
														rows="5"
														placeholder="Kodu buraya yazın..."
													/>
												</div>
											)}
											<button
												type="button"
												onClick={() => removeBlock(index)}
												className="mt-2 text-red-500 text-sm"
											>
												Bloğu Sil
											</button>
										</div>
									))}
								</div>

								{/* Blok Ekleme Butonları */}
								<div className="flex gap-2">
									<button
										type="button"
										onClick={addTextBlock}
										className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
									>
										+ Yazı Bloğu Ekle
									</button>
									<button
										type="button"
										onClick={addCodeBlock}
										className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
									>
										+ Kod Bloğu Ekle
									</button>
								</div>

								{/* Gönder Butonu */}
								<button
									type="submit"
									className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Yazıyı Yayınla
								</button>
							</form>
						</div>

						{/* Mevcut yazıları görüntüleme */}
						<div className="mb-8">
							<PostList />
						</div>
					</>
				);
			case 'categories':
				return <CategoryManager />;
			case 'codeExamples':
				return <CodeExampleManager />;
			default:
				return null;
		}
	};

	return (
		<div className="container mx-auto p-4">
			{/* Tab Menüsü */}
			<div className="flex space-x-4 mb-6">
				<button
					onClick={() => setActiveTab('posts')}
					className={`px-4 py-2 rounded-lg ${
						activeTab === 'posts' 
							? 'bg-blue-500 text-white' 
							: 'bg-gray-700 hover:bg-gray-600'
					}`}
				>
					Yazılar
				</button>
				<button
					onClick={() => setActiveTab('categories')}
					className={`px-4 py-2 rounded-lg ${
						activeTab === 'categories' 
							? 'bg-blue-500 text-white' 
							: 'bg-gray-700 hover:bg-gray-600'
					}`}
				>
					Kategoriler
				</button>
				<button
					onClick={() => setActiveTab('codeExamples')}
					className={`px-4 py-2 rounded-lg ${
						activeTab === 'codeExamples' 
							? 'bg-blue-500 text-white' 
							: 'bg-gray-700 hover:bg-gray-600'
					}`}
				>
					Kod Örnekleri
				</button>
			</div>

			{/* Tab İçeriği */}
			{renderTabContent()}
		</div>
	);
}