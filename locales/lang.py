import json
import os
from typing import Dict, Any, Set
from deep_translator import GoogleTranslator
from time import sleep
from tqdm import tqdm
import sys
import random
import re

class JSONTranslator:
    def __init__(self):
        # 定义目标语言列表
        self.target_languages = {
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh-CN': 'Simplified Chinese',
            'zh-TW': 'Traditional Chinese',
            'fr': 'French',
            'de': 'German',
            'es': 'Spanish',
            'it': 'Italian'
        }
        
        # 品牌词和专有名词（不翻译）
        self.brand_names = {
            "Apple",
            "Google",
            "Microsoft",
            "Tesla",
            "Mochi 1 Preview",
            "Mochi 1",
            # 在这里添加更多品牌词
        }
        
        # 特定翻译词典
# 特定翻译词典
        self.custom_translations = {
            # 简体中文
            'zh-CN': {
                'home': '主页',
                'about': '关于我们',
                'contact': '联系我们',
                'products': '产品中心',
                'services': '服务支持',
                'news': '新闻动态',
                'search': '搜索',
                'login': '登录',
                'register': '注册',
                'account': '账户中心',
                'cart': '购物车',
                'checkout': '结账',
                'logout': '退出登录',
                'profile': '个人资料',
                'settings': '设置',
                'dashboard': '控制台',
                'orders': '订单管理',
                'wishlist': '收藏夹',
                'help': '帮助中心',
                'faq': '常见问题',
                'privacy': '隐私政策',
                'terms': '使用条款',
                'shipping': '配送说明',
                'returns': '退换政策',
                'categories': '商品分类',
                'subscribe': '订阅',
                'more': '更多',
                'menu': '菜单',
                'close': '关闭',
                'back': '返回',
                'submit': '提交',
                'cancel': '取消',
                'save': '保存',
                'delete': '删除',
                'edit': '编辑',
                'update': '更新',
                'welcome': '欢迎',
                'password': '密码',
                'email': '邮箱',
                'phone': '电话',
                'address': '地址'
            },
            # 日语
            'ja': {
                'home': 'ホーム',
                'about': '会社概要',
                'contact': 'お問い合わせ',
                'products': '製品情報',
                'services': 'サービス',
                'news': 'ニュース',
                'search': '検索',
                'login': 'ログイン',
                'register': '新規登録',
                'account': 'アカウント',
                'cart': 'カート',
                'checkout': '購入手続き',
                'logout': 'ログアウト',
                'profile': 'プロフィール',
                'settings': '設定',
                'dashboard': 'ダッシュボード',
                'orders': '注文履歴',
                'wishlist': 'お気に入り',
                'help': 'ヘルプ',
                'faq': 'よくある質問',
                'privacy': 'プライバシーポリシー',
                'terms': '利用規約',
                'shipping': '配送について',
                'returns': '返品・交換',
                'categories': 'カテゴリー',
                'subscribe': '登録',
                'more': 'もっと見る',
                'menu': 'メニュー',
                'close': '閉じる',
                'back': '戻る',
                'submit': '送信',
                'cancel': 'キャンセル',
                'save': '保存',
                'delete': '削除',
                'edit': '編集',
                'update': '更新',
                'welcome': 'ようこそ',
                'password': 'パスワード',
                'email': 'メール',
                'phone': '電話番号',
                'address': '住所'
            },
            # 韩语
            'ko': {
                'home': '홈',
                'about': '회사 소개',
                'contact': '문의하기',
                'products': '제품',
                'services': '서비스',
                'news': '뉴스',
                'search': '검색',
                'login': '로그인',
                'register': '회원가입',
                'account': '계정',
                'cart': '장바구니',
                'checkout': '결제하기',
                'logout': '로그아웃',
                'profile': '프로필',
                'settings': '설정',
                'dashboard': '대시보드',
                'orders': '주문내역',
                'wishlist': '위시리스트',
                'help': '도움말',
                'faq': '자주 묻는 질문',
                'privacy': '개인정보처리방침',
                'terms': '이용약관',
                'shipping': '배송안내',
                'returns': '반품/교환',
                'categories': '카테고리',
                'subscribe': '구독하기',
                'more': '더 보기',
                'menu': '메뉴',
                'close': '닫기',
                'back': '뒤로',
                'submit': '제출',
                'cancel': '취소',
                'save': '저장',
                'delete': '삭제',
                'edit': '편집',
                'update': '업데이트',
                'welcome': '환영합니다',
                'password': '비밀번호',
                'email': '이메일',
                'phone': '전화번호',
                'address': '주소'
            },
            # 繁体中文
            'zh-TW': {
                'home': '首頁',
                'about': '關於我們',
                'contact': '聯絡我們',
                'products': '產品中心',
                'services': '服務支援',
                'news': '新聞動態',
                'search': '搜尋',
                'login': '登入',
                'register': '註冊',
                'account': '帳戶中心',
                'cart': '購物車',
                'checkout': '結帳',
                'logout': '登出',
                'profile': '個人資料',
                'settings': '設定',
                'dashboard': '控制台',
                'orders': '訂單管理',
                'wishlist': '收藏夾',
                'help': '幫助中心',
                'faq': '常見問題',
                'privacy': '隱私政策',
                'terms': '使用條款',
                'shipping': '配送說明',
                'returns': '退換政策',
                'categories': '商品分類',
                'subscribe': '訂閱',
                'more': '更多',
                'menu': '選單',
                'close': '關閉',
                'back': '返回',
                'submit': '提交',
                'cancel': '取消',
                'save': '保存',
                'delete': '刪除',
                'edit': '編輯',
                'update': '更新',
                'welcome': '歡迎',
                'password': '密碼',
                'email': '電子郵件',
                'phone': '電話',
                'address': '地址'
            },
            # 法语
            'fr': {
                'home': 'Accueil',
                'about': 'À propos',
                'contact': 'Contact',
                'products': 'Produits',
                'services': 'Services',
                'news': 'Actualités',
                'search': 'Rechercher',
                'login': 'Connexion',
                'register': "S'inscrire",
                'account': 'Mon compte',
                'cart': 'Panier',
                'checkout': 'Paiement',
                'logout': 'Déconnexion',
                'profile': 'Profil',
                'settings': 'Paramètres',
                'dashboard': 'Tableau de bord',
                'orders': 'Commandes',
                'wishlist': 'Liste de souhaits',
                'help': 'Aide',
                'faq': 'FAQ',
                'privacy': 'Confidentialité',
                'terms': "Conditions d'utilisation",
                'shipping': 'Livraison',
                'returns': 'Retours',
                'categories': 'Catégories',
                'subscribe': "S'abonner",
                'more': 'Plus',
                'menu': 'Menu',
                'close': 'Fermer',
                'back': 'Retour',
                'submit': 'Envoyer',
                'cancel': 'Annuler',
                'save': 'Enregistrer',
                'delete': 'Supprimer',
                'edit': 'Modifier',
                'update': 'Mettre à jour',
                'welcome': 'Bienvenue',
                'password': 'Mot de passe',
                'email': 'E-mail',
                'phone': 'Téléphone',
                'address': 'Adresse'
            },
            # 德语
            'de': {
                'home': 'Startseite',
                'about': 'Über uns',
                'contact': 'Kontakt',
                'products': 'Produkte',
                'services': 'Dienstleistungen',
                'news': 'Neuigkeiten',
                'search': 'Suche',
                'login': 'Anmelden',
                'register': 'Registrieren',
                'account': 'Konto',
                'cart': 'Warenkorb',
                'checkout': 'Zur Kasse',
                'logout': 'Abmelden',
                'profile': 'Profil',
                'settings': 'Einstellungen',
                'dashboard': 'Dashboard',
                'orders': 'Bestellungen',
                'wishlist': 'Wunschliste',
                'help': 'Hilfe',
                'faq': 'FAQ',
                'privacy': 'Datenschutz',
                'terms': 'Nutzungsbedingungen',
                'shipping': 'Versand',
                'returns': 'Rückgabe',
                'categories': 'Kategorien',
                'subscribe': 'Abonnieren',
                'more': 'Mehr',
                'menu': 'Menü',
                'close': 'Schließen',
                'back': 'Zurück',
                'submit': 'Absenden',
                'cancel': 'Abbrechen',
                'save': 'Speichern',
                'delete': 'Löschen',
                'edit': 'Bearbeiten',
                'update': 'Aktualisieren',
                'welcome': 'Willkommen',
                'password': 'Passwort',
                'email': 'E-Mail',
                'phone': 'Telefon',
                'address': 'Adresse'
            },
            # 西班牙语
            'es': {
                'home': 'Inicio',
                'about': 'Sobre nosotros',
                'contact': 'Contacto',
                'products': 'Productos',
                'services': 'Servicios',
                'news': 'Noticias',
                'search': 'Buscar',
                'login': 'Iniciar sesión',
                'register': 'Registrarse',
                'account': 'Mi cuenta',
                'cart': 'Carrito',
                'checkout': 'Finalizar compra',
                'logout': 'Cerrar sesión',
                'profile': 'Perfil',
                'settings': 'Configuración',
                'dashboard': 'Panel de control',
                'orders': 'Pedidos',
                'wishlist': 'Lista de deseos',
                'help': 'Ayuda',
                'faq': 'Preguntas frecuentes',
                'privacy': 'Privacidad',
                'terms': 'Términos de uso',
                'shipping': 'Envío',
                'returns': 'Devoluciones',
                'categories': 'Categorías',
                'subscribe': 'Suscribirse',
                'more': 'Más',
                'menu': 'Menú',
                'close': 'Cerrar',
                'back': 'Volver',
                'submit': 'Enviar',
                'cancel': 'Cancelar',
                'save': 'Guardar',
                'delete': 'Eliminar',
                'edit': 'Editar',
                'update': 'Actualizar',
                'welcome': 'Bienvenido',
                'password': 'Contraseña',
                'email': 'Correo electrónico',
                'phone': 'Teléfono',
                'address': 'Dirección'
            },
            # 意大利语
            'it': {
                'home': 'Home',
                'about': 'Chi siamo',
                'contact': 'Contatti',
                'products': 'Prodotti',
                'services': 'Servizi',
                'news': 'Notizie',
                'search': 'Cerca',
                'login': 'Accedi',
                'register': 'Registrati',
                'account': 'Account',
                'cart': 'Carrello',
                'checkout': 'Checkout',
                'logout': 'Esci',
                'profile': 'Profilo',
                'settings': 'Impostazioni',
                'dashboard': 'Dashboard',
                'orders': 'Ordini',
                'wishlist': 'Lista dei desideri',
                'help': 'Aiuto',
                'faq': 'FAQ',
                'privacy': 'Privacy',
                'terms': 'Termini e condizioni',
                'shipping': 'Spedizione',
                'returns': 'Resi',
                'categories': 'Categorie',
                'subscribe': 'Iscriviti',
                'more': 'Altro',
                'menu': 'Menu',
                'close': 'Chiudi',
                'back': 'Indietro',
                'submit': 'Invia',
                'cancel': 'Annulla',
                'save': 'Salva',
                'delete': 'Elimina',
                'edit': 'Modifica',
                'update': 'Aggiorna',
                'welcome': 'Benvenuto',
                'password': 'Password',
                'email': 'Email',
                'phone': 'Telefono',
                'address': 'Indirizzo'
            }
        }
        
        self.max_retries = 3
        self.chunk_size = 4500
        
        # 加载外部词典文件（如果存在）
        self.load_dictionaries()
    
    def load_dictionaries(self):
        """从外部文件加载词典"""
        try:
            # 加载品牌词
            brand_file = 'brand_names.txt'
            if os.path.exists(brand_file):
                with open(brand_file, 'r', encoding='utf-8') as f:
                    self.brand_names.update(line.strip() for line in f if line.strip())
            
            # 加载特定翻译词典
            custom_dict_file = 'custom_translations.json'
            if os.path.exists(custom_dict_file):
                with open(custom_dict_file, 'r', encoding='utf-8') as f:
                    custom_dict = json.load(f)
                    for lang, translations in custom_dict.items():
                        if lang in self.custom_translations:
                            self.custom_translations[lang].update(translations)
                        else:
                            self.custom_translations[lang] = translations
            
        except Exception as e:
            print(f"加载词典文件时出错: {str(e)}")
    
    def is_brand_name(self, text: str) -> bool:
        """检查文本是否包含品牌词"""
        return text in self.brand_names
    
    def get_custom_translation(self, text: str, target_lang: str) -> str:
        """获取特定翻译，如果存在的话"""
        if target_lang in self.custom_translations:
            return self.custom_translations[target_lang].get(text.lower())
        return None
    
    def translate_with_retry(self, text: str, target_lang: str) -> str:
        """带有重试机制的翻译函数"""
        if not isinstance(text, str) or not text.strip():
            return text
        
        # 检查是否是品牌词
        if self.is_brand_name(text):
            return text
        
        # 检查是否有特定翻译
        custom_translation = self.get_custom_translation(text, target_lang)
        if custom_translation:
            return custom_translation
        
        # 提取需要保护的品牌词
        protected_words = []
        for brand in self.brand_names:
            if brand in text:
                protected_words.append(brand)
        
        # 使用占位符替换品牌词
        placeholder_map = {}
        modified_text = text
        for i, word in enumerate(protected_words):
            placeholder = f"BRAND_{i}"
            placeholder_map[placeholder] = word
            modified_text = modified_text.replace(word, placeholder)
        
        # 翻译处理
        for attempt in range(self.max_retries):
            try:
                if len(modified_text) > self.chunk_size:
                    chunks = self.chunk_text(modified_text)
                    translated_chunks = []
                    for chunk in chunks:
                        translator = GoogleTranslator(source='en', target=target_lang)
                        translated_chunk = translator.translate(chunk)
                        translated_chunks.append(translated_chunk)
                        sleep(random.uniform(1, 2))
                    translated_text = ' '.join(translated_chunks)
                else:
                    translator = GoogleTranslator(source='en', target=target_lang)
                    translated_text = translator.translate(modified_text)
                
                # 还原品牌词
                for placeholder, original in placeholder_map.items():
                    translated_text = translated_text.replace(placeholder, original)
                
                return translated_text
                
            except Exception as e:
                if attempt == self.max_retries - 1:
                    print(f"\n警告: 翻译失败 ({e}), 返回原文")
                    return text
                sleep(random.uniform(2, 4))
        
        return text

    def chunk_text(self, text: str) -> list:
        """将长文本分成更小的块"""
        if len(text) <= self.chunk_size:
            return [text]
        
        chunks = []
        current_chunk = ""
        words = text.split()
        
        for word in words:
            if len(current_chunk) + len(word) + 1 <= self.chunk_size:
                current_chunk += " " + word if current_chunk else word
            else:
                chunks.append(current_chunk)
                current_chunk = word
        
        if current_chunk:
            chunks.append(current_chunk)
        
        return chunks

    def translate_value(self, value: Any, target_lang: str, pbar: tqdm) -> Any:
        """翻译字符串值，保持其他类型值不变"""
        if isinstance(value, str):
            result = self.translate_with_retry(value, target_lang)
            pbar.update(1)
            return result
        elif isinstance(value, dict):
            return self.translate_dict(value, target_lang, pbar)
        elif isinstance(value, list):
            return [self.translate_value(item, target_lang, pbar) for item in value]
        else:
            return value

    def count_translatable_items(self, data: Any) -> int:
        """计算需要翻译的字符串数量"""
        if isinstance(data, str):
            return 1
        elif isinstance(data, dict):
            return sum(self.count_translatable_items(v) for v in data.values())
        elif isinstance(data, list):
            return sum(self.count_translatable_items(item) for item in data)
        return 0

    def translate_dict(self, data: Dict, target_lang: str, pbar: tqdm) -> Dict:
        """递归翻译字典中的所有字符串值"""
        translated_data = {}
        for key, value in data.items():
            translated_data[key] = self.translate_value(value, target_lang, pbar)
        return translated_data

    def translate_all(self, input_dir: str = '.'):
        """从en.json翻译到所有目标语言"""
        try:
            input_file = os.path.join(input_dir, 'en.json')
            
            if not os.path.exists(input_file):
                raise FileNotFoundError(f"未找到英文源文件: {input_file}")
            
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            print(f"已读取英文源文件: {input_file}")
            print(f"已加载 {len(self.brand_names)} 个品牌词")
            print(f"已加载特定翻译词典，支持 {len(self.custom_translations)} 种语言")
            
            total_items = self.count_translatable_items(data)
            
            for lang_code, lang_name in self.target_languages.items():
                print(f"\n[{lang_name}] 开始翻译...")
                
                with tqdm(total=total_items, desc=f"翻译进度", 
                         bar_format='{l_bar}{bar:30}{r_bar}{bar:-10b}') as pbar:
                    translated_data = self.translate_dict(data, lang_code, pbar)
                
                output_file = os.path.join(input_dir, f"{lang_code.lower()}.json")
                
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(translated_data, f, ensure_ascii=False, indent=2)
                
                print(f"✓ 已完成 {lang_name} 翻译: {output_file}")
            
            print("\n所有翻译任务已完成！")
            
        except Exception as e:
            print(f"\n错误: {str(e)}")
            sys.exit(1)

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    translator = JSONTranslator()
    translator.translate_all(current_dir)

if __name__ == "__main__":
    main()