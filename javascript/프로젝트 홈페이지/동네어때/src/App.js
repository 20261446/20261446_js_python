import React, { useState, useEffect, useMemo } from 'react';
import "./App.css";
import DongneLogo from "./DongneLogo";
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc, getDocs, serverTimestamp, increment, arrayUnion, query, orderBy } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { MessageSquare, ThumbsUp, PlusCircle, LogOut, Send, MapPin, Clock, Settings, X, Palette, Moon, Sun, Trash2, Pencil } from 'lucide-react';

// --- 1. Firebase 설정 ---
const firebaseConfig = {
  apiKey: "AIzaSyDXY-M28HUCJZwV-dbdc_jN6_-w2Lnoiks",
  authDomain: "my-neighborhood-app-2d7ba.firebaseapp.com",
  projectId: "my-neighborhood-app-2d7ba",
  storageBucket: "my-neighborhood-app-2d7ba.firebasestorage.app",
  messagingSenderId: "1025858926964",
  appId: "1:1025858926964:web:931bd4301f57dbef645421",
  measurementId: "G-GDHHEZB1MB"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- 2. 카테고리 및 AI 키워드 ---
const CATEGORIES = ["도로/교통", "환경/공원", "안전/치안", "건축/건설", "기타"];
const AI_KEYWORDS = {
  "도로/교통": ["도로", "교통", "불법주차", "주차", "신호등", "지하철", "버스", "과속", "포트홀", "싱크홀", "차선", "보도블록", "횡단보도", "정체", "갓길", "유턴", "일방통행", "자전거", "렉카"],
  "환경/공원": ["공원", "환경", "쓰레기", "나무", "청소", "악취", "소음", "매연", "수질", "벤치", "산책로", "가로수", "분리수거", "오물", "매립", "하수도", "미세먼지", "벌레", "방역", "분수", "담배"],
  "안전/치안": ["가로등", "CCTV", "범죄", "경찰", "소방", "화재", "위험", "치안", "도난", "순찰", "폭력", "비상벨", "보안등", "불량배", "방범", "붕괴", "누전", "가스", "침수", "대피소"],
  "건축/건설": ["공사", "재개발", "건물", "불법건축", "균열", "붕괴", "인테리어", "아파트", "빌라", "토목", "진동", "먼지", "공사장", "비계", "철거", "증축", "조망권", "일조권", "분양", "층간소음"]
};

const autoClassify = (t, c) => {
  const fullText = (t + " " + c).trim();
  if (!fullText) return CATEGORIES[0];
  let scores = { "도로/교통": 0, "환경/공원": 0, "안전/치안": 0, "건축/건설": 0 };
  Object.keys(AI_KEYWORDS).forEach(cat => {
    AI_KEYWORDS[cat].forEach(keyword => {
      const regex = new RegExp(keyword, 'g');
      const matches = fullText.match(regex);
      if (matches) scores[cat] += matches.length;
    });
  });
  let maxScore = 0;
  let candidates = [];
  Object.keys(scores).forEach(cat => {
    if (scores[cat] > maxScore) { maxScore = scores[cat]; candidates = [cat]; }
    else if (scores[cat] === maxScore && maxScore > 0) { candidates.push(cat); }
  });
  return maxScore === 0 ? "기타" : candidates[0];
};

const THEME_COLORS = [
  { name: '블루', color: '#2563eb' }, { name: '하늘', color: '#7dd3fc' },
  { name: '그린', color: '#16a34a' }, { name: '노랑', color: '#facc15' },
  { name: '오렌지', color: '#ea580c' }, { name: '빨강', color: '#ef4444' },
  { name: '퍼플', color: '#7c3aed' }, { name: '다크', color: '#334155' }
];
const REGION_DATA = {
  화성: [
    "봉담읍", "우정읍", "향남읍", "남양읍",
    "매송면", "비봉면", "마도면", "송산면", "서신면", "팔탄면", "장안면", "양감면", "정남면",
    "새솔동", "진안동", "병점1동", "병점2동", "반월동", "기배동", "화산동",
    "동탄1동", "동탄2동", "동탄3동", "동탄4동", "동탄5동", "동탄6동", "동탄7동", "동탄8동", "동탄9동"
  ],
  수원: [
    "장안구", "권선구", "팔달구", "영통구"
  ],
  서울: [
    "종로구", "중구", "용산구", "성동구", "광진구",
    "동대문구", "중랑구", "성북구", "강북구", "도봉구",
    "노원구", "은평구", "서대문구", "마포구", "양천구",
    "강서구", "구로구", "금천구", "영등포구", "동작구",
    "관악구", "서초구", "강남구", "송파구", "강동구"
  ]
};

const CITIES = Object.keys(REGION_DATA).sort((a, b) => a.localeCompare(b, 'ko'));

const ADMIN_UIDS = [
  "BwNJO8IalkcnPmf1UsJHAzDRElG3",
  "D2rUkgJOsgUH3RTAaSqhKMytAch2",
  "01n6zpJyuDZcCXZNnNlOjfhxOMC2",
  "3kEJD8x85JV9tQ4Ejjk3sDaESGq2"
];

const isAdmin = (user) =>
  !!user && ADMIN_UIDS.includes(user.uid);

 const getTodayKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// --- 3. 댓글 컴포넌트 ---
const CommentSection = ({ postId, user, isDarkMode, primaryColor, getTextColor }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const isAdminUser = isAdmin(user);
  const getRelativeTime = (ts) => {
  if (!ts) return "방금 전";

  const now = new Date();
  const date = ts.toDate();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "방금 전";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};



  useEffect(() => {
    const q = query(collection(db, "grievances", postId, "comments"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [postId]);

  useEffect(() => {
  if (!user?.email) return;

  const todayKey = getTodayKey();
  const savedCommentCount = localStorage.getItem(`commentCount_${user.email}_${todayKey}`);

  setCommentCount(savedCommentCount ? Number(savedCommentCount) : 0);
}, [user]);

  const addComment = async () => {
  if (!newComment.trim() || !user) return;

  if (!isAdminUser && commentCount >= 3) {
    alert("댓글 작성은 하루 3번까지만 가능합니다.");
    return;
  }

  await addDoc(collection(db, "grievances", postId, "comments"), {
    text: newComment,
    userName: user.displayName,
    userPhoto: user.photoURL,
    userId: user.uid,
    createdAt: serverTimestamp()
  });

  if (!isAdminUser) {
    const todayKey = getTodayKey();
    const nextCommentCount = commentCount + 1;
    setCommentCount(nextCommentCount);
    localStorage.setItem(
      `commentCount_${user.email}_${todayKey}`,
      String(nextCommentCount)
    );
  }

  setNewComment("");
};

  const deleteComment = async (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "grievances", postId, "comments", commentId));
    }
  };

  return (
    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className="space-y-3 mb-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2 items-start text-[13px]">
            <img src={c.userPhoto} className="w-6 h-6 rounded-full mt-0.5" alt="u" />
            <div className={`flex-1 p-2 px-3 rounded-2xl relative ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
              <div className="flex justify-between items-start mb-1">
  <div className="flex flex-col">
    <span className="font-bold text-[11px] opacity-70">{c.userName}</span>
    <span className="text-[10px] opacity-50">{getRelativeTime(c.createdAt)}</span>
  </div>

  {user && user.uid === c.userId && (
    <button
      onClick={() => deleteComment(c.id)}
      className="text-red-400 hover:text-red-600 transition p-1"
    >
      <Trash2 size={12} />
    </button>
  )}
</div>
              <div className="break-all">{c.text}</div>
            </div>
          </div>
        ))}
      </div>
 
       {user && !isAdminUser && (
       <div className={`text-[11px] mb-2 font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      오늘 남은 댓글: {Math.max(0, 3 - commentCount)}회
      </div>
    )}

      {user && (
        <div className="flex gap-2">
          <input className={`flex-1 px-3 py-2.5 rounded-xl text-sm outline-none border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`} placeholder="댓글 입력..." value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addComment()} />
          <button onClick={addComment} className="p-2.5 px-3 rounded-xl transition shadow-sm" style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor) }}><Send size={14} /></button>
        </div>
      )}
    </div>
  );
};

// --- 4. 메인 앱 컴포넌트 ---
export default function App() {
  const [user, setUser] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#2563eb'); 
  const [isDarkMode, setIsDarkMode] = useState(false); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortType, setSortType] = useState("latest");
  const [city, setCity] = useState("화성");
  const [district, setDistrict] = useState(REGION_DATA["화성"][0]);
  const [isAnonymous, setIsAnonymous] = useState(false);

const [selectedCity, setSelectedCity] = useState("전체");
const [selectedDistrict, setSelectedDistrict] = useState("전체");
const isAdminUser = isAdmin(user);
const [myCity, setMyCity] = useState("화성");
const [myDistrict, setMyDistrict] = useState(REGION_DATA["화성"][0]);
  const filteredGrievances = useMemo(() => {
  let result;

  if (selectedTab === "HOT") {
  result = grievances.filter(item => item.wasHot === true);
} else {
  result = [...grievances];
}

if (selectedCategory !== "전체") {
  result = result.filter(item => item.category === selectedCategory);
}

  if (selectedCity !== "전체") {
  result = result.filter(item => item.city === selectedCity);
}

if (selectedDistrict !== "전체") {
  result = result.filter(item => item.district === selectedDistrict);
}

  if (sortType === "popular") {
    result.sort((a, b) => {
      const upvotesDiff = (b.upvotes || 0) - (a.upvotes || 0);
      if (upvotesDiff !== 0) return upvotesDiff;

      const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
      const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
      return bTime - aTime;
    });
  } else {
    result.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
      const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
      return bTime - aTime;
    });
  }

  return result;
}, [grievances, selectedTab, selectedCategory, selectedCity, selectedDistrict, sortType]);

  useEffect(() => {
    if (title.trim() || text.trim()) setCategory(autoClassify(title, text));
  }, [title, text]);

  
  useEffect(() => {
  if (!REGION_DATA[city]?.includes(district)) {
    setDistrict(REGION_DATA[city][0]);
  }
}, [city, district]);


  useEffect(() => {
  if (selectedCity === "전체") {
    setSelectedDistrict("전체");
  } else {
    setSelectedDistrict("전체");
  }
}, [selectedCity]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
  if (!user?.email) return;

  const todayKey = getTodayKey();

  const savedPostCount = localStorage.getItem(`postCount_${user.email}_${todayKey}`);

setPostCount(savedPostCount ? Number(savedPostCount) : 0);
  
}, [user]);

  useEffect(() => {
  const savedAnonymous = localStorage.getItem("isAnonymous");
  if (savedAnonymous === "true") {
    setIsAnonymous(true);
  }
}, []);
  
  useEffect(() => {
  const savedMyCity = localStorage.getItem("myCity");
  const savedMyDistrict = localStorage.getItem("myDistrict");

  if (savedMyCity && REGION_DATA[savedMyCity]) {
    setMyCity(savedMyCity);

    if (savedMyDistrict && REGION_DATA[savedMyCity].includes(savedMyDistrict)) {
      setMyDistrict(savedMyDistrict);
    } else {
      setMyDistrict(REGION_DATA[savedMyCity][0]);
    }
  }
}, []);

  useEffect(() => {
  if (!REGION_DATA[myCity].includes(myDistrict)) {
    setMyDistrict(REGION_DATA[myCity][0]);
  }
}, [myCity, myDistrict]);

  useEffect(() => {
    const q = query(collection(db, "grievances"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setGrievances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getTextColor = (hex) => (hex === '#facc15' || hex === '#7dd3fc') ? '#1f2937' : '#ffffff';
  const getRelativeTime = (ts) => {
  if (!ts) return "방금 전";

  const now = new Date();
  const date = ts.toDate();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return "방금 전";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};
  const formatDateTime = (ts) => {
  if (!ts) return "방금 전";

  const date = ts.toDate();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  return `${month}월 ${day}일 ${period} ${displayHour}:${minutes}`;
};


  const login = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  const saveMyRegion = () => {
  localStorage.setItem("myCity", myCity);
  localStorage.setItem("myDistrict", myDistrict);

  setSelectedCity(myCity);
  setSelectedDistrict(myDistrict);

  alert("내 지역이 저장되었습니다.");
};

  const toggleAnonymousMode = () => {
  const nextValue = !isAnonymous;
  setIsAnonymous(nextValue);
  localStorage.setItem("isAnonymous", String(nextValue));
};

  
const addPost = async () => {
  if (!text.trim() || !title.trim() || !user) return;

  // 새 게시글 작성일 때만 하루 작성 제한 적용
  if (!isEditingPost && !isAdminUser && postCount >= 3) {
    alert("글 작성은 하루 3번까지만 가능합니다.");
    return;
  }

  try {
    if (isEditingPost && editingPostId) {
      // 기존 게시글 수정
      const post = grievances.find(
        (item) => item.id === editingPostId
      );

      if (!post) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        return;
      }

      if (!isAdminUser && post.userId !== user.uid) {
        alert("본인이 작성한 게시글만 수정할 수 있습니다.");
        return;
      }

      await updateDoc(doc(db, "grievances", editingPostId), {
        title,
        text,
        category,
        city,
        district,
        location: `${city} ${district}`,
        updatedAt: serverTimestamp()
      });

      alert("게시글이 수정되었습니다.");
    } else {
      // 새 게시글 등록
      await addDoc(collection(db, "grievances"), {
        title,
        text,
        category,
        city,
        district,
        location: `${city} ${district}`,
        upvotes: 0,
        upvoters: [],
        wasHot: false,
        createdAt: serverTimestamp(),
        userName: isAnonymous ? "익명" : user.displayName,
        userPhoto: isAnonymous
          ? `https://ui-avatars.com/api/?name=익명&background=${primaryColor.replace("#", "")}&color=fff&bold=true`
          : user.photoURL,
        userId: user.uid
      });

      // 일반 사용자의 새 글 작성 횟수 기록
      if (!isAdminUser) {
        const todayKey = getTodayKey();
        const nextPostCount = postCount + 1;

        setPostCount(nextPostCount);
        localStorage.setItem(
          `postCount_${user.email}_${todayKey}`,
          String(nextPostCount)
        );
      }

      alert("민원이 등록되었습니다.");
    }

    // 작성·수정이 끝나면 입력값 초기화
    setTitle("");
    setText("");
    setIsEditingPost(false);
    setEditingPostId(null);
    setSelectedTab("전체");
    setIsWriteOpen(false);
  } catch (e) {
    console.error("게시글 저장 실패:", e);
    alert(
      isEditingPost
        ? "게시글 수정에 실패했습니다. 권한이나 네트워크를 확인해 주세요."
        : "민원 등록에 실패했습니다."
    );
  }
};


  
const deletePost = async (id) => {
  if (!user) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (window.confirm("이 민원글을 삭제하시겠습니까?")) {
    try {
      await deleteDoc(doc(db, "grievances", id));
    } catch (e) {
      console.error("게시글 삭제 실패:", e);
      alert("게시글 삭제에 실패했습니다. 권한이나 네트워크를 확인해 주세요.");
    }
  }
};



const editPost = async (post) => {
  if (!user) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (!isAdminUser && post.userId !== user.uid) {
    alert("본인이 작성한 게시글만 수정할 수 있습니다.");
    return;
  }

  setEditingPostId(post.id);
  setTitle(post.title || "");
  setText(post.text || "");
  setCategory(post.category || CATEGORIES[0]);
  setCity(post.city || "화성");
  setDistrict(post.district || REGION_DATA["화성"][0]);
  setIsAnonymous(false);
  setIsEditingPost(true);
  setIsWriteOpen(true);
  
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

};


const cancelEditPost = () => {
  setTitle("");
  setText("");
  setCategory(CATEGORIES[0]);
  setCity(myCity);
  setDistrict(myDistrict);
  setIsAnonymous(false);
  setEditingPostId(null);
  setIsEditingPost(false);
  setIsWriteOpen(false);
};


const deleteAllPosts = async () => {
  const ok = window.confirm("모든 글을 삭제할까요?");
  if (!ok) return;

  try {
    const snapshot = await getDocs(collection(db, "grievances"));

    for (const postDoc of snapshot.docs) {
      await deleteDoc(doc(db, "grievances", postDoc.id));
    }

    alert("모든 글이 삭제되었습니다.");
  } catch (e) {
    alert("전체 삭제 실패!");
  }
};

  const showMyRegionPosts = () => {
  setSelectedCity(myCity);
  setSelectedDistrict(myDistrict);
};

  const showAllRegions = () => {
  setSelectedCity("전체");
  setSelectedDistrict("전체");
};

  const upvote = async (id, veters = []) => {
  if (!user) return alert("로그인 필요!");
  if (veters.includes(user.uid)) return alert("이미 공감하셨습니다.");

  await updateDoc(doc(db, "grievances", id), {
    upvotes: increment(1),
    upvoters: arrayUnion(user.uid)
  });

  setTimeout(() => {
    markHotPosts();
  }, 500);
};

 const markHotPosts = async () => {
  try {
    const popularPosts = [...grievances]
      .filter(item => (item.upvotes || 0) > 0)
      .sort((a, b) => {
        const upvotesDiff = (b.upvotes || 0) - (a.upvotes || 0);
        if (upvotesDiff !== 0) return upvotesDiff;

        const aTime = a.createdAt?.toDate?.()?.getTime?.() || 0;
        const bTime = b.createdAt?.toDate?.()?.getTime?.() || 0;
        return bTime - aTime;
      })
      .slice(0, 3);

    for (const post of popularPosts) {
      if (!post.wasHot) {
        await updateDoc(doc(db, "grievances", post.id), {
          wasHot: true
        });
      }
    }
  } catch (e) {
    console.error("HOT 게시글 기록 실패:", e);
  }
};
useEffect(() => {
  if (grievances.length > 0) {
    markHotPosts();
  }
}, [grievances]);
  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* 네비바 */}
      <nav className={`sticky top-0 z-40 border-b px-3 sm:px-6 py-3 transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}`}>
  <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
    <div
      className="flex items-center gap-2 min-w-0 flex-1"
      style={{ color: primaryColor }}
    >
      <MessageSquare size={22} fill="currentColor" className="shrink-0" />
      <div className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
        <DongneLogo />
      </div>
    </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-500'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400"><Settings size={22} /></button>
            {user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
                <img src={user.photoURL} alt="p" className="w-8 h-8 rounded-full border border-gray-400" />
                <button
                onClick={logout}
                className={`min-h-[44px] px-3 rounded-lg text-[13px] font-bold whitespace-nowrap transition flex items-center gap-1 ${
                isDarkMode ? 'bg-gray-700 text-red-400' : 'bg-red-50 text-red-600'
  }`}
>
  <LogOut size={14} />
  <span className="hidden sm:inline">로그아웃</span>
</button>
              </div>
            ) : (
              <button onClick={login} className="px-5 py-2 rounded-full text-sm font-bold shadow-md" style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor) }}>로그인</button>
            )}
          </div>
        </div>
      </nav>

      {/* 설정 모달 */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className={`rounded-3xl w-full max-w-sm p-6 shadow-2xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><Palette size={20} style={{ color: primaryColor }} /> 테마 설정</h3><button onClick={() => setIsSettingsOpen(false)} className="text-gray-400"><X /></button></div>
            <div className="grid grid-cols-4 gap-4 mb-8">{THEME_COLORS.map((t) => (<button key={t.name} onClick={() => setPrimaryColor(t.color)} className={`aspect-square rounded-2xl border-4 transition ${primaryColor === t.color ? 'border-gray-400 scale-110 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: t.color }} />))}</div>
            <div className="mb-6">
  <div className="text-sm font-bold mb-3">내 지역 설정</div>

    <div className="mb-6">
  <div className="flex items-center justify-between">
    <div>
      <div className="text-sm font-bold">익명 모드</div>
      <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        글 작성 시 닉네임 대신 익명으로 표시됩니다.
      </div>
    </div>

    <button
      onClick={toggleAnonymousMode}
      className={`px-4 py-2 rounded-full text-xs font-bold transition ${
        isAnonymous
          ? 'text-white'
          : isDarkMode
          ? 'bg-gray-700 text-gray-300'
          : 'bg-gray-100 text-gray-600'
      }`}
      style={isAnonymous ? { backgroundColor: primaryColor } : {}}
    >
      {isAnonymous ? "ON" : "OFF"}
    </button>
  </div>
</div>

  <div className="flex gap-2 mb-3">
    <select
      value={myCity}
      onChange={(e) => setMyCity(e.target.value)}
      className={`flex-1 px-3 py-2 rounded-xl text-sm border outline-none ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
      }`}
    >
      {CITIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>

    <select
      value={myDistrict}
      onChange={(e) => setMyDistrict(e.target.value)}
      className={`flex-1 px-3 py-2 rounded-xl text-sm border outline-none ${
        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
      }`}
    >
      {[...REGION_DATA[myCity]].sort((a, b) => a.localeCompare(b, 'ko')).map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  </div>

  <button
    onClick={saveMyRegion}
    className="w-full py-3 rounded-2xl font-bold"
    style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor) }}
  >
    내 지역 저장
  </button>
</div>
            <button onClick={() => setIsSettingsOpen(false)} className="w-full py-4 rounded-2xl font-bold" style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor) }}>적용 완료</button>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto mt-5 sm:mt-8 px-3 sm:px-4 pb-20">
        <div className="mb-4 sm:mb-6">
  {user ? (
    <button
      
      
      onClick={() => {
        if (isEditingPost) {
          cancelEditPost();
        } else {
          if (!isWriteOpen) {
            setCity(myCity);
            setDistrict(myDistrict);
          }
          setIsWriteOpen((prev) => !prev);
        }
      }}


      className="w-full min-h-[48px] rounded-2xl font-black text-base shadow-md flex items-center justify-center gap-2"
      style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor) }}
    >
      <PlusCircle size={20} />

      {isEditingPost
        ? (isWriteOpen ? "수정 취소" : "민원 수정하기")
        : (isWriteOpen ? "새 민원 접수 닫기" : "새 민원 접수하기")}

    </button>
  ) : (
    <div
      className="p-6 rounded-2xl text-center shadow-xl text-white"
      style={{ backgroundColor: primaryColor }}
    >
      <p className="font-black text-lg sm:text-xl">
        우리 동네의 불편함을 알려주세요! 📢
      </p>
      <p className="mt-2 text-sm opacity-90">로그인 후 민원을 접수할 수 있어요.</p>
    </div>
  )}
</div>

{user && isWriteOpen && (
  <div
    className={`rounded-2xl border p-4 sm:p-6 mb-6 sm:mb-8 transition-colors ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
    }`}
  >
    <div
      className="flex items-center gap-2 mb-4 font-bold text-lg"
      style={{ color: primaryColor }}
    >

      {isEditingPost ? <Pencil size={22} /> : <PlusCircle size={22} />}
      <span>{isEditingPost ? "민원 수정하기" : "새 민원 접수"}</span>

    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-400">자동 감지:</span>
        <span
          className="text-xs font-black px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
        >
          {category}
        </span>
      </div>

      {!isAdminUser && (
  <div className={`text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    오늘 남은 글: {Math.max(0, 3 - postCount)}회
  </div>
)}

      <input
        className={`w-full p-4 rounded-xl outline-none border transition font-bold ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
        }`}
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-400">지역 선택:</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full min-h-[44px] px-3 py-3 rounded-xl text-sm border outline-none ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className={`w-full min-h-[44px] px-3 py-3 rounded-xl text-sm border outline-none ${
              isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {[...REGION_DATA[city]]
              .sort((a, b) => a.localeCompare(b, 'ko'))
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </div>
      </div>

      <textarea
        className={`w-full p-4 rounded-xl outline-none border transition h-40 resize-none ${
          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'
        }`}
        placeholder="내용을 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      
      <button
        onClick={addPost}
        className="w-full py-4 rounded-xl font-black text-lg shadow-lg"
        style={{ backgroundColor: primaryColor, color: getTextColor(primaryColor) }}
      >
        <Send size={20} className="inline mr-2" />
        {isEditingPost ? "민원 수정하기" : "민원 제출하기"}
      </button>
    </div>
  </div>
)}

        <div className="space-y-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-1 gap-3">
  <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 whitespace-nowrap leading-none">
    <MapPin size={20} className="text-red-500 shrink-0" />
    <span className="whitespace-nowrap">실시간 민원 현황</span>
  </h3>

  <div className="grid grid-cols-3 sm:flex gap-2">
    <button
  onClick={showMyRegionPosts}
  className={`min-h-[44px] px-3 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${
    isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-50 text-blue-600'
  }`}
>
  내 주변
</button>



<button
  onClick={showAllRegions}
  className={`min-h-[44px] px-3 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition ${
    isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'
  }`}
>
  전체지역
</button>

{isAdminUser && (
  <button
    onClick={deleteAllPosts}
    className="min-h-[44px] px-3 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap bg-red-50 text-red-600"
  >
    전체 삭제
  </button>
)}
  </div>
</div>
          <div className="flex gap-2 overflow-x-auto pt-1 pl-1 pb-2 scrollbar-hide">
  {["전체", "HOT"].map((tab) => (
    <button
      key={tab}
      onClick={() => setSelectedTab(tab)}
      className={`min-h-[44px] min-w-[96px] px-4 py-2 rounded-full text-[15px] font-bold whitespace-nowrap transition-all ${
        selectedTab === tab
          ? 'text-white scale-105 shadow-md'
          : (isDarkMode
              ? 'bg-gray-800 text-gray-400 border border-gray-700'
              : 'bg-white text-gray-500 border border-gray-100')
      }`}
      style={selectedTab === tab ? { backgroundColor: primaryColor } : {}}
    >
      {tab}
    </button>    
  ))}
</div>
<div className="flex items-center gap-2 pb-2">
  <span className={`text-xs font-bold whitespace-nowrap ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
    카테고리
  </span>

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className={`px-3 py-2 rounded-full text-xs font-bold border outline-none ${
      isDarkMode
        ? 'bg-gray-800 border-gray-700 text-gray-300'
        : 'bg-white border-gray-200 text-gray-600'
    }`}
  >
    <option value="전체">전체</option>
    {CATEGORIES.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</div>

          <div className="flex gap-2 overflow-x-auto pt-1 pl-1 pb-2 scrollbar-hide">
  {["전체", ...CITIES].map((c) => (
    <button
      key={c}
      onClick={() => setSelectedCity(c)}
      className={`min-h-[44px] min-w-[96px] px-4 py-2 rounded-full text-[15px] font-bold whitespace-nowrap transition-all ${
        selectedCity === c
          ? 'text-white scale-105 shadow-md'
          : (isDarkMode
              ? 'bg-gray-800 text-gray-400 border border-gray-700'
              : 'bg-white text-gray-500 border border-gray-100')
      }`}
      style={selectedCity === c ? { backgroundColor: primaryColor } : {}}
    >
      {c}
    </button>
  ))}
</div>
    {selectedCity !== "전체" && (
  <div className="flex gap-2 overflow-x-auto pt-1 pl-1 pb-2 scrollbar-hide">
  {[
    "전체",
    ...[...REGION_DATA[selectedCity]].sort((a, b) => a.localeCompare(b, 'ko'))
  ].map((d) => (
    <button
      key={d}
      onClick={() => setSelectedDistrict(d)}
      className={`min-h-[44px] min-w-[96px] px-4 py-2 rounded-full text-[15px] font-bold whitespace-nowrap transition-all ${
        selectedDistrict === d
          ? 'text-white scale-105 shadow-md'
          : (isDarkMode
              ? 'bg-gray-800 text-gray-400 border border-gray-700'
              : 'bg-white text-gray-500 border border-gray-100')
      }`}
      style={selectedDistrict === d ? { backgroundColor: primaryColor } : {}}
    >
      {d}
    </button>
  ))}
</div>
)}
          <div className="flex gap-2 pb-2">
  <button
    onClick={() => setSortType("latest")}
    className={`px-3 py-2 rounded-full text-xs font-black transition-all ${
      sortType === "latest"
        ? "text-white shadow-md"
        : isDarkMode
        ? "bg-gray-800 text-gray-400 border border-gray-700"
        : "bg-white text-gray-500 border border-gray-100"
    }`}
    style={sortType === "latest" ? { backgroundColor: primaryColor } : {}}
  >
    최신순
  </button>

  <button
    onClick={() => setSortType("popular")}
    className={`px-3 py-2 rounded-full text-xs font-black transition-all ${
      sortType === "popular"
        ? "text-white shadow-md"
        : isDarkMode
        ? "bg-gray-800 text-gray-400 border border-gray-700"
        : "bg-white text-gray-500 border border-gray-100"
    }`}
    style={sortType === "popular" ? { backgroundColor: primaryColor } : {}}
  >
    인기순
  </button>
</div>

          {loading ? (
            <div className="text-center py-20 text-gray-500 font-bold">로딩 중...</div>
          ) : filteredGrievances.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-3xl text-gray-400 font-bold">접수된 민원이 없습니다.</div>
          ) : (
            filteredGrievances.map((item, index) => {
  const isHot =
  (sortType === "popular" && index < 3 && (item.upvotes || 0) > 0) ||
  (selectedTab === "HOT" && item.wasHot);

  return (
              <div
  key={item.id}
  className={`rounded-2xl p-4 sm:p-6 border transition-all ${
    isHot
      ? isDarkMode
        ? 'bg-gray-800 border-orange-400 shadow-[0_0_0_1px_rgba(251,146,60,0.35),0_10px_30px_rgba(249,115,22,0.18)]'
        : 'bg-orange-50 border-orange-200 shadow-[0_10px_30px_rgba(249,115,22,0.15)]'
      : isDarkMode
      ? 'bg-gray-800 border-gray-700 shadow-md'
      : 'bg-white border-gray-100 shadow-md'
  }`}
>
                <div className="flex justify-between items-center mb-4">
  <div className="flex items-center gap-2">
    <span
      className="text-[10px] font-black px-2.5 py-1 rounded-lg"
      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
    >
      #{item.category}
    </span>

    {isHot && (
    <span
    className="flex items-center px-3 py-1.5 rounded-full text-[10px] font-semibold text-white"
    style={{
      background: "linear-gradient(135deg, #ff7a18 0%, #ff3d5a 100%)",
      boxShadow: "0 4px 10px rgba(255, 80, 80, 0.18)"
    }}
  >
  
    HOT
  </span>
)}
  </div>

  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-gray-400 font-medium text-[11px]">
                        <Clock size={12} /> <span>{getRelativeTime(item.createdAt)}</span></div>
                    {/* 게시글 삭제 버튼: 로그인 정보가 있고 작성자 ID가 일치할 때만 표시 */}
                    
                    {/* 관리자 또는 게시글 작성자에게 수정·삭제 버튼 표시 */}
                    {user && (isAdminUser || item.userId === user.uid) && (
                      <>
                        <button onClick={() => editPost(item)} className="text-blue-400 hover:text-blue-600 transition p-1" title="게시글 수정">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deletePost(item.id)} className="text-red-400 hover:text-red-600 transition p-1" title="게시글 삭제">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}

                  </div>
                </div>
                <h4 className="text-base sm:text-lg font-bold mb-2 leading-tight">{item.title}</h4>

<div className={`text-xs mb-2 font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
  📍 {item.location || `${item.city || ""} ${item.district || ""}`.trim() || "지역 미지정"}
</div>

<p className={`text-[13px] sm:text-sm mb-5 sm:mb-6 whitespace-pre-wrap ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
  {item.text}
</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><img src={item.userPhoto || "https://via.placeholder.com/50"} className="w-5 h-5 rounded-full" alt="u" /><span className="text-xs font-bold text-gray-500">{item.userName}</span></div>
                  <button onClick={() => upvote(item.id, item.upvoters)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${item.upvoters?.includes(user?.uid) ? '' : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-600')}`} style={item.upvoters?.includes(user?.uid) ? { backgroundColor: primaryColor, color: getTextColor(primaryColor) } : {}}>
                    <ThumbsUp size={14} fill={item.upvoters?.includes(user?.uid) ? "currentColor" : "none"} /><span>공감 {item.upvotes}</span>
                  </button>
                </div>
                <CommentSection postId={item.id} user={user} isDarkMode={isDarkMode} primaryColor={primaryColor} getTextColor={getTextColor} />
              </div>
            );
           })
          )}
        </div>
      </main>
    </div>
  );
}