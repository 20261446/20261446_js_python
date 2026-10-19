/*
 * 여행 스타일 테스트 - 별도 JS 파일
 * 기존 HTML 내부의 코드는 옮기거나 삭제하지 않았습니다.
 * HTML의 원래 함수/placeholder를 이 파일에서 덮어써 테스트 동작을 연결합니다.
 *
 * 현재 성격 축 5개:
 * 자연/인프라, 외향/내향, 계획/즉흥, 음식 선호/비선호, 명소 선호/비선호
 * 5개 축의 조합은 2^5 = 32가지입니다.
 */
(() => {
    "use strict";

    const travelQuestions = [
        { topic: "자연 / 인프라", q: "여행을 가면 숲, 바다, 산처럼 자연을 느낄 수 있는 장소를 방문하고 싶다.", axis: "nature", reverse: false },
        { topic: "자연 / 인프라", q: "여행지의 자연경관보다 쇼핑몰, 번화가, 편리한 교통시설을 즐기는 것이 더 좋다.", axis: "nature", reverse: true },
        { topic: "자연 / 인프라", q: "사람이 많은 관광지보다 한적한 자연 속에서 시간을 보내는 것이 좋다.", axis: "nature", reverse: false },

        { topic: "외향 / 내향", q: "여행지에서 새로운 사람들과 대화하거나 어울리는 것이 즐겁다.", axis: "social", reverse: false },
        { topic: "외향 / 내향", q: "여행 중에는 여러 사람과 함께 다니기보다 혼자만의 시간을 갖고 싶다.", axis: "social", reverse: true },
        { topic: "외향 / 내향", q: "현지 축제나 활기찬 거리처럼 사람들로 북적이는 장소에 가면 에너지가 생긴다.", axis: "social", reverse: false },

        { topic: "계획 / 즉흥", q: "여행을 떠나기 전에 방문할 장소와 이동 경로를 미리 정해두는 편이다.", axis: "planning", reverse: false },
        { topic: "계획 / 즉흥", q: "여행 중 계획이 바뀌어도 그때그때 마음에 드는 곳으로 이동하는 것이 좋다.", axis: "planning", reverse: true },
        { topic: "계획 / 즉흥", q: "여행 일정이 미리 정리되어 있어야 마음이 편하고 시간을 효율적으로 쓸 수 있다.", axis: "planning", reverse: false },

        { topic: "음식 선호 / 비선호", q: "여행지를 선택할 때 그 지역의 유명한 음식이나 맛집이 중요한 기준이다.", axis: "food", reverse: false },
        { topic: "음식 선호 / 비선호", q: "여행 중에는 맛집을 찾아다니기보다 간단하게 식사를 해결하고 관광에 집중하고 싶다.", axis: "food", reverse: true },
        { topic: "음식 선호 / 비선호", q: "여행을 가면 평소에 먹어보지 못한 현지 음식이나 새로운 메뉴를 꼭 경험하고 싶다.", axis: "food", reverse: false },

        { topic: "명소 선호 / 비선호", q: "여행을 가면 그 지역에서 유명한 랜드마크나 대표 관광지를 꼭 방문하고 싶다.", axis: "sights", reverse: false },
        { topic: "명소 선호 / 비선호", q: "유명 관광지보다 현지인들이 자주 가는 숨은 장소를 발견하는 것이 좋다.", axis: "sights", reverse: true },
        { topic: "명소 선호 / 비선호", q: "여행지를 정할 때 인터넷에서 유명한 관광 명소가 얼마나 있는지 살펴보는 편이다.", axis: "sights", reverse: false }
    ];

    const answerOptions = [
        { score: 5, label: "매우 그렇다", sub: "(5점)" },
        { score: 4, label: "그렇다", sub: "(4점)" },
        { score: 3, label: "보통이다", sub: "(3점)" },
        { score: 2, label: "그렇지 않다", sub: "(2점)" },
        { score: 1, label: "매우 아니다", sub: "(1점)" }
    ];

    
    const axisSettings = {
        nature:   { first: "N", second: "I", firstName: "자연", secondName: "인프라" },
        social:   { first: "E", second: "Q", firstName: "외향", secondName: "내향" },
        planning: { first: "P", second: "S", firstName: "계획", secondName: "즉흥" },
        food:     { first: "F", second: "O", firstName: "음식 선호", secondName: "음식 비선호" },
        sights:   { first: "L", second: "X", firstName: "명소 선호", secondName: "명소 비선호" }
    };

    const axisOrder = ["nature", "social", "planning", "food", "sights"];
    const travelAnswers = Array(travelQuestions.length).fill(null);
    let questionIndex = 0;
    let selectedAnswer = null;
    let transitionLock = false;

    const byId = id => document.getElementById(id);

    function beginTravelTest() {
        questionIndex = 0;
        selectedAnswer = null;
        transitionLock = false;
        travelAnswers.fill(null);
        byId("screen-intro").classList.add("hidden");
        byId("screen-result").classList.add("hidden");
        byId("screen-question").classList.remove("hidden");
        displayTravelQuestion();
    }

    function displayTravelQuestion() {
        selectedAnswer = travelAnswers[questionIndex];
        transitionLock = false;
        const item = travelQuestions[questionIndex];

        byId("q-topic-title").textContent = item.topic;
        byId("question-text").textContent = `"${item.q}"`;
        byId("q-progress-text").textContent = `${questionIndex + 1} / ${travelQuestions.length}`;
        byId("progress-bar").style.width = `${((questionIndex + 1) / travelQuestions.length) * 100}%`;

        const container = byId("options-container");
        container.innerHTML = "";

        answerOptions.forEach(option => {
            const isSelected = selectedAnswer === option.score;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "flex flex-col items-center group focus:outline-none transition-all";
            button.setAttribute("aria-label", `${option.label} ${option.sub}`);

            const circle = document.createElement("div");
            circle.className = isSelected
                ? "w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center shadow-lg text-white scale-110 transition-all duration-200"
                : "w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-300 bg-white group-hover:border-orange-400 group-hover:bg-orange-50 flex items-center justify-center transition-all shadow-sm";
            circle.textContent = isSelected ? "✓" : "";
            circle.classList.add("text-lg", "font-bold");

            const label = document.createElement("span");
            label.className = `text-[11px] sm:text-xs ${isSelected ? "font-bold text-orange-600" : "font-semibold text-slate-700"} mt-2`;
            label.textContent = option.label;

            
            button.append(circle, label);

            
            button.addEventListener("click", () => {
                button.blur();
                recordTravelAnswer(option.score);
            });

            container.appendChild(button);
        });
    }

    function recordTravelAnswer(score) {
        if (transitionLock) return;
        transitionLock = true;
        selectedAnswer = score;
        travelAnswers[questionIndex] = score;
        displaySelectedOption(score);

        window.setTimeout(() => {
            questionIndex += 1;
            if (questionIndex < travelQuestions.length) {
                displayTravelQuestion();
            } else {
                displayTravelResult();
            }
        }, 220);
    }

    function displaySelectedOption(score) {
        // 선택 직후 버튼을 다시 그려 선택 상태를 보여주되, 다음 질문 전환은 한 번만 처리합니다.
        selectedAnswer = score;
        const buttons = byId("options-container").querySelectorAll("button");
        buttons.forEach((button, index) => {
            const option = answerOptions[index];
            const circle = button.querySelector("div");
            const label = button.querySelectorAll("span")[0];
            const isSelected = option.score === score;

            circle.className = isSelected
                ? "w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center shadow-lg text-white scale-110 transition-all duration-200 text-lg font-bold"
                : "w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-slate-300 bg-white group-hover:border-orange-400 group-hover:bg-orange-50 flex items-center justify-center transition-all shadow-sm text-lg font-bold";
            circle.textContent = isSelected ? "✓" : "";
            label.className = `text-[11px] sm:text-xs ${isSelected ? "font-bold text-orange-600" : "font-semibold text-slate-700"} mt-2`;
        });
    }

    function calculateTravelScores() {
        const totals = Object.fromEntries(axisOrder.map(axis => [axis, 0]));
        travelQuestions.forEach((question, index) => {
            const raw = travelAnswers[index];
            const adjusted = question.reverse ? 6 - raw : raw;
            totals[question.axis] += adjusted;
        });
        return totals;
    }





const travelTypeNamesByCode = {
    // 자연 중심 유형
    NEPFL: "자연·계획형 휴식가",
    NEPFX: "자연·미식형 식도락가",
    NEPOL: "자연·명소형 탐방가",
    NEPOX: "자연·로컬 탐험가",
    NESFL: "자연·외향형 액티비티족",
    NESFX: "자유로운 미식 탐방가",
    NESOL: "사교적 피크닉가",
    NESOX: "자연·즉흥형 탐험가",

    NQPFL: "차분한 산사 휴식가",
    NQPFX: "자연·내향형 힐링가",
    NQPOL: "체계적 자연 치유가",
    NQPOX: "자연·해변 휴식가",
    NQSFL: "액티브 자연 체험가",
    NQSFX: "감성 힐링 여행가",
    NQSOL: "차분한 정원 산책가",
    NQSOX: "자유로운 해안 기행가",

    // 인프라 중심 유형
    IEPFL: "인프라·계획형 미식가",
    IEPFX: "인프라·도심 미식가",
    IEPOL: "인프라·명소형 문화가",
    IEPOX: "체계적 도심 관람가",
    IESFL: "인프라·외향형 핫플가",
    IESFX: "사교적 야경 미식가",
    IESOL: "사교적 도심 문화가",
    IESOX: "인프라·즉흥형 탐험가",

    IQPFL: "전통 문화 미식가",
    IQPFX: "인프라·내향형 휴식가",
    IQPOL: "체계적 역사 탐방가",
    IQPOX: "인프라·녹지 휴식가",
    IQSFL: "전통 유적 탐험가",
    IQSFX: "로컬 역사 미식가",
    IQSOL: "인프라·스트리트 탐험가",
    IQSOX: "차분한 고택 탐방가"
};




    

    
function determineTravelType(scores) {
    const letters = {};
    const names = [];

    axisOrder.forEach(axis => {
        const setting = axisSettings[axis];
        const chooseFirst = scores[axis] >= 10;

        letters[axis] = chooseFirst
            ? setting.first
            : setting.second;

        names.push(
            chooseFirst
                ? setting.firstName
                : setting.secondName
        );
    });

    const code = axisOrder
        .map(axis => letters[axis])
        .join("");

    const title = travelTypeNamesByCode[code]
        || `${names.join(" · ")}형 여행자`;

    return {
        code,
        letters,
        names,
        title
    };
}



const travelTypeDescriptions = {
    // 자연 중심 유형
    NEPFL: "휴식도 엄격한 스케줄에 맞춰서 진행되는 인공 힐링",
    NEPFX: "경치 보러 간 게 아니라 경치 좋은 식당 가려고 간 사람",
    NEPOL: "자연 감상보다 '내가 여기 왔다'는 인증이 더 중요한 프로 출석러",
    NEPOX: "아무도 안 가는 오지 찾아가서 고생을 자처하는 프로 야생러",
    NESFL: "가만히 누워있으면 온몸에 가시가 돋는 에너자이저",
    NESFX: "발길 닿는 대로 가지만 결국 도착하는 곳은 맛집 앞",
    NESOL: "자연은 거들 뿐, 사실 사람들과 왁자지껄 노는 게 진짜 목적인 타입",
    NESOX: "계획이란 단어 자체를 거부하는 야생의 무임승차급 자유로운 영혼",

    NQPFL: "속세 피해서 산속 들어갔는데 마음은 여전히 번뇌로 가득 찬 타입",
    NQPFX: "자연 속에서 아무것도 안 할 자유를 계획적으로 누리는 프라이빗 힐링러",
    NQPOL: "치유와 건강조차 통제와 루틴 속에서 실행하는 FM 치유자",
    NQPOX: "바다 멍때리기의 달인, 사실 바다보단 누워있는 게 좋은 사람",
    NQSFL: "몸을 극한으로 혹사시켜야 비로소 '아, 힐링했다'를 느끼는 타입",
    NQSFX: "현실의 삭막함을 피해 감성 사진 한 장으로 삶을 연명하는 감성 유목민",
    NQSOL: "과격한 건 싫고 잘 가꿔진 자연만 골라서 산책하는 평화주의자",
    NQSOX: "바닷길 따라 발길 닿는 대로 유랑하는 낭만파 낭만 보스",

    // 인프라 중심 유형
    IEPFL: "동선과 환승 시간까지 계산해서 맛집 투어 다니는 엑셀 마스터",
    IEPFX: "도시의 편리함 없이는 밥 한 끼도 제대로 못 먹는 지극히 현대적인 입맛",
    IEPOL: "유명 전시와 미술관은 다 가봐야 직성이 풀리는 도심 문화 수집가",
    IEPOX: "도시가 제공하는 쾌적함과 체계 속에서만 안정을 느끼는 도시 순혈주의자",
    IESFL: "사람 많고 인스타에서 제일 핫한 곳만 골라 다니는 인싸 중의 인싸",
    IESFX: "화려한 도시 불빛 아래서 분위기와 알코올에 취하는 낭만주의자",
    IESOL: "약속 장소는 무조건 교통 편하고 핫한 도심 한복판이어야 하는 핫플 모임러",
    IESOX: "발길 닿는 대로 걷지만 항상 도심 지하철역 근처를 벗어나지 않는 안전한 자유인",

    IQPFL: "역사 깊은 노포와 전통 한식에 환장하는 클래식한 맛집 검증가",
    IQPFX: "인프라는 완벽하지만 조용하고 혼자 있을 수 있는 공간만 찾아다니는 집돌이/집순이 여행자",
    IQPOL: "역사적 배경지식 다 정독하고 박물관 설명문 하나하나 다 읽는 팩트 폭격기",
    IQPOX: "자연은 좋지만 아스팔트 길과 깔끔한 화장실이 보장된 공원만 가는 타협형 힐링러",
    IQSFL: "역사 현장이라면 전국 어디든 발로 뛰어다니는 열정 만렙 문화재 탐험가",
    IQSFX: "그 지역의 역사와 얽힌 스토리 있는 음식에 환장하는 감성 미식가",
    IQSOL: "도시의 골목골목과 로컬 스트리트를 샅샅이 파헤치는 골목 탐험가",
    IQSOX: "한옥 고택의 처마 밑에서 바람 소리 들으며 겉폼 잡는 감성파"
};



const travelTypeComments = {
    // 자연 중심 유형
    NEPFL: [
        "힐링하러 자연에 갔다면서 숲속 산책 시간까지 분 단위로 계획해 둠.",
        "'아 편안하다'라고 말하면서 속으로는 다음 일정 알람 타이머 계산하고 있음.",
        "자연의 미학을 즐긴다기보단 엑셀에 적어둔 '자연 감상 타임'을 해치우는 중."
    ],
    NEPFX: [
        "풍경 사진 찍는 척하면서 카메라 렌즈는 밑에 차려진 한상차림에 고정되어 있음.",
        "자연 속에서 힐링된 이유: 공기가 좋아서가 아니라 방금 먹은 산채비빔밥이 맛있어서.",
        "배고프면 아무리 절경이어도 감흥 제로, 입에 뭐 하나 물려줘야 비로소 경치가 보임."
    ],
    NEPOL: [
        "쉬러 왔다면서 유명 국립공원 도장 깨느라 무릎 연골 다 갈아 넣는 타입.",
        "자연을 눈에 담는 시간보다 남들이 다 찍는 그 대표 포토존 줄 서는 시간이 더 긺.",
        "경치가 아무리 아름다워도 랜드마크 바위 사진 못 찍으면 그 여행은 실패한 여행임."
    ],
    NEPOX: [
        "남들 다 가는 유명 산은 안 가고 지도에도 잘 안 나오는 동네 뒷산 오솔길로만 다님.",
        "진짜 로컬을 느끼겠다며 오지 들어갔다가 데이터 안 터져서 속으로 오열한 적 있음.",
        "관광지 싫다면서 굳이 고생길 골라가 놓고 '이게 진짜 여행이지'라며 정신승리함."
    ],
    NESFL: [
        "휴식하러 여행 간다더니 서핑, 등산, 패러글라이딩 다 하고 지쳐서 출근함.",
        "자연 속에서 가만히 멍때리는 시간을 세상에서 제일 버거워하고 지루해함.",
        "팀원들 다 지쳐서 피똥 싸고 있는데 혼자 '다음엔 바다 수영하러 갈까?' 외침."
    ],
    NESFX: [
        "무계획 여행이라면서 여행지에 도착하자마자 현지 맛집 검색창부터 켬.",
        "경치 보기 위해 걷는 게 아니라 다음 맛집까지 소화시키려고 걷는 타입.",
        "여행 경로의 유일한 기준: '지금 내 배고픔의 정도'와 '주변 식당 평점'."
    ],
    NESOL: [
        "캠핑 가는 이유: 자연의 소리를 들으려고(X), 밤새 술 마시며 수다 떨려고(O).",
        "고요한 숲속 힐링을 바란다면서 혼자 두면 5분 만에 심심해서 몸부림침.",
        "경치 감상보다 지나가는 다른 여행객한테 말 걸고 친해지는 데 에너지 다 씀."
    ],
    NESOX: [
        "여행 가방 싸면서 '가서 생각하지 뭐' 했다가 현지 도착해서 숙소 찾는 타입.",
        "바다 가기로 해놓고 가다가 표지판 보고 갑자기 산으로 방향 틀어버림.",
        "우연이 주는 낭만을 즐긴다지만 사실 그냥 게을러서 계획을 안 짠 거임."
    ],
    NQPFL: [
        "번뇌를 비우러 템플스테이 간다면서 머릿속엔 '도착해서 뭐 하지?' 생각뿐임.",
        "고요함과 적막을 사랑한다면서 막상 밤에 너무 어두우면 살짝 무서워함.",
        "마음의 평화를 찾았다며 미소 짓지만, 스마트폰 와이파이 안 터지면 은근 불안해함."
    ],
    NQPFX: [
        "자연이 좋은 이유: 나무나 풀은 나한테 말을 걸거나 리액션을 요구하지 않아서.",
        "쉬러 가서 진짜 숨만 쉬고 있음. 남들이 보면 어디 아픈 사람인 줄 쎔.",
        "'나 찾아가지 마' 감성으로 떠났는데 막상 아무한테도 연락 안 오면 은근 섭섭해함."
    ],
    NQPOL: [
        "몸과 마음을 치유하러 가는데 치유 루틴표를 엑셀 파일로 정리해서 들고 감.",
        "'숲의 피톤치드를 마시는 최적의 시간대 따지느라 이미 머리 아파짐.",
        "자연 치유 받으러 왔는데 계획한 대로 안 풀리면 스트레스받아서 역효과 남."
    ],
    NQPOX: [
        "해변에서 바다 바라보며 멍때린다면서 10분 지나면 폰으로 SNS 피드 넘기고 있음.",
        "파도 소리 들으며 힐링한다더니 30분 만에 꿀잠 빠져서 햇빛에 새까맣게 탐.",
        "낭만적인 해변 휴양을 꿈꿨지만 결국 남는 건 신발 속으로 기어 들어온 모래뿐임."
    ],
    NQSFL: [
        "자연을 온몸으로 체험하겠다며 등산·트레킹 풀코스 돌고 오한 얻어서 돌아옴.",
        "체험이란 체험은 다 신청해 두고 피곤하다고 징징대면서 다음 코스로 이동함.",
        "편하게 쉬는 건 힐링이 아니라 '지루함'이라고 생각해서 사서 고생을 즐김."
    ],
    NQSFX: [
        "자연 속 감성 힐링이라 쓰고, 인스타그램 업로드용 인생샷 건지기라 읽음.",
        "햇살과 바람을 느끼는 척하지만 머릿속은 '이 사진 필터 뭐 쓰지?' 생각 중.",
        "낭만 가득한 감성 숙소 예약해 놓고 정작 풀벌레 소리 때문에 밤새 잠 못 듦."
    ],
    NQSOL: [
        "자연을 좋아하지만 흙먼지 묻거나 날벌레 날아다니는 진짜 야생은 질색함.",
        "정원 산책하며 평화로운 척하지만 내적으론 '다음 카페 어디 가지?' 계산 중.",
        "수목원이나 예쁜 정원만 골라 가면서 스스로 '나는 자연을 사랑해'라고 착각함."
    ],
    NQSOX: [
        "해안 도로 드라이브하다가 '우와' 하고 내렸는데 강풍에 머리 산발 되고 철수함.",
        "계획 없이 바다만 보고 달리다가 기름 떨어져서 식은땀 흘린 적 있음.",
        "바다 가고 싶다고 노래를 불러놓고 막상 도착하면 바닷바람 비린내에 오래 못 버텼음."
    ],

    // 인프라 중심 유형
    IEPFL: [
        "맛집 웨이팅 시간까지 분 단위로 계산해서 코스 짜놓고 웨이팅 길어지면 멘붕 옴.",
        "식당 동선 효율성에 집착하느라 같이 간 사람 걸음 속도까지 체크하고 있음.",
        "맛있는 걸 먹으러 간 게 아니라 내가 짜둔 '완벽한 맛집 동선'을 완성하러 간 타입."
    ],
    IEPFX: [
        "도심 핫플 맛집은 귀신같이 찾아가면서 자연 속 야외 평상은 벌레 때문에 거들떠도 안 봄.",
        "에어컨 잘 나오고 주차 편한 빌딩 맛집 가놓고 '내 입맛에 딱 맞다'며 만족해함.",
        "풍경 좋은 시골 맛집 가자고 하면 표정 어두워지면서 은근슬쩍 도심 쇼핑몰 식당가 제안함."
    ],
    IEPOL: [
        "유명 전시회 가서 예술 작품을 감상하는 척하지만 속으로는 포토존 줄 언제 줄어드나 봄.",
        "문화생활 즐긴다고 말하지만 도파민 충전용 도심 핫플 도장 깨기 하고 있는 거임.",
        "전시회 보고 나오자마자 굿즈 숍으로 직행해서 기념품에 통장 잔고 털어 넣음."
    ],
    IEPOX: [
        "미술관이나 박물관 동선대로 안 움직이고 냅다 흩어지는 사람 보면 속에서 천불 남.",
        "쾌적한 도심 관람을 즐긴다면서 오디오 가이드 들으며 동선 지키느라 혼자 바쁨.",
        "날씨 안 좋으면 야외 코스 바로 폐기하고 무조건 지하철 연결된 쾌적한 실내로 도피함."
    ],
    IESFL: [
        "웨이팅 2시간 넘는 핫플에 서 있으면서 피곤해하기는커녕 라이브 방송 켜고 싶어 함.",
        "고요한 자연에 던져놓으면 30분 만에 지루해서 '서울 가고 싶다'고 노래 부름.",
        "인스타그램 핫플 지도에 저장된 장소만 500개, 정작 제대로 다 둘러보지도 못함."
    ],
    IESFX: [
        "도시 야경 보면서 분위기 잡지만 사실 야경보다 테이블 위의 와인과 안주 사진에 더 진심임.",
        "밤이 깊어질수록 에너지가 솟아나서 주변 사람들 다 집 가고 싶어 하는데 혼자 2차 외침.",
        "멋진 루프탑 바 예약해 놓고 추워서 오들오들 떨면서도 '분위기 대박이지?'라며 버팀."
    ],
    IESOL: [
        "모임 장소 정할 때 '중간 지점'이라면서 은근슬쩍 자기가 좋아하는 도심 핫플로 유도함.",
        "공연이나 전시 보러 가자고 해놓고 정작 만나서는 수다 떨고 술 마시는 데 힘 다 씀.",
        "사람 많고 시끄러운 도심 한복판에 있어야 비로소 살아있음을 느끼는 타입."
    ],
    IESOX: [
        "즉흥적으로 발길 닿는 대로 다닌다면서 네이버 지도 켜고 현대백화점 부근만 서성임.",
        "자유로운 영혼인 척하지만 편의점과 올리브영이 눈앞에 안 보이면 은근 불안해함.",
        "새로운 거리에 도전해 본다며 들어간 골목에서 길 잃고 결국 택시 호출 앱 켬."
    ],
    IQPFL: [
        "요즘 인스타 감성 맛집은 거들떠도 안 보고 30년 전통 노포만 골라서 찾아다님.",
        "전통의 맛을 논하면서 밑반찬 조미료 맛 고스란히 감지하고 혼자 품평회 열고 있음.",
        "친구들이 디저트 카페 가자고 하면 은근슬쩍 한옥 찻집이나 떡 카페로 길 안내함."
    ],
    IQPFX: [
        "편의시설 잘 갖춰진 고급 호텔이나 쾌적한 카페 가놓고 종일 창밖만 바라보다 옴.",
        "도시의 편리함은 누리고 싶지만 타인과의 접촉은 최소화하고 싶은 극강의 프라이빗파.",
        "남들이 '거기까지 가서 그것만 하고 왔어?'라고 물어보면 세상 뿌듯한 표정 지음."
    ],
    IQPOL: [
        "유적지 가서 풍경 감상하는 친구 옆에서 '그게 몇 년도에 만들어졌냐면~' 하면서 TMI 방출함.",
        "문화재 안내판 글씨 한 줄도 안 놓치고 다 읽느라 일행들 다 지쳐서 저만큼 멀어져 있음.",
        "가이드북이나 설명문에 오타나 오류 발견하면 하루 종일 그것만 신경 씀."
    ],
    IQPOX: [
        "자연을 사랑한다면서 흙길은 신발 더러워진다고 정돈된 잔디밭이나 데크길만 골라 걸음.",
        "숲속 힐링을 원한다면서 공원 내 카페테리아 에어컨 바람 아래 누워있는 게 제일 행복함.",
        "벌레 한 마리만 날아와도 기겁하면서 '역시 잘 가꿔진 도심 공원이 최고야'를 외침."
    ],
    IQSFL: [
        "유적지 둘러본다며 하루에 2만 보씩 걸어 다니고 일행들 체력 방전시켜 버림.",
        "경치 감상보다 유적지 돌탑이나 기와 조각 하나에 더 열광해서 친구들 어리둥절하게 만듦.",
        "'여기 옛날에 누가 살았게?' 하면서 퀴즈 내는데 아무도 관심 없어서 혼자 답변함."
    ],
    IQSFX: [
        "음식 먹기 전에 이 음식이 유래된 백 년 전 역사 스토리 특강을 동행에게 강제로 실시함.",
        "단순히 맛있는 것보다 '스토리가 있는 노포'에 가면 평점이 무조건 2배로 상승함.",
        "로컬 역사 맛집이라 해서 갔는데 그냥 평범한 맛이면 스토리로 맛을 감싸 안으려고 함."
    ],
    IQSOL: [
        "유명한 대형 쇼핑몰 두고 굳이 좁고 미로 같은 힙한 골목길만 찾아서 들어감.",
        "골목 감성 느낀다며 사진 찍다가 골목길 오토바이 소리에 깜짝 놀라 길 가장자리로 밀려남.",
        "구석구석 다 찾아냈다고 자부하지만 알고 보면 인스타그램 핫플 로드맵 그대로 따라간 거임."
    ],
    IQSOX: [
        "고택 대청마루에 앉아 고즈넉함을 만끽하는 척하지만 속으로는 바닥 딱딱해서 엉덩이 아파함.",
        "한옥의 고요한 미학을 논하다가도 방 안에 벌레 한 마리 나타나면 비명 지르고 뛰어나옴.",
        "전통과 역사를 사랑한다면서 정작 숙소는 한옥 스타일의 풀옵션 현대식 시설만 찾음."
    ]
};





    
function buildTravelComment(type) {
    // 현재 여행 유형에 해당하는 멘트 3개 가져오기
    const comments = travelTypeComments[type.code];

    // 해당 유형의 멘트를 찾지 못했을 때의 예외 처리
    if (!comments || comments.length === 0) {
        console.error("여행 유형 멘트를 찾을 수 없습니다:", type.code);
        return "당신만의 여행 스타일을 발견했어요!";
    }

    // 3개 중 하나를 무작위로 선택
    const randomIndex = Math.floor(Math.random() * comments.length);

    return comments[randomIndex];
}

    function buildTravelChecklist(type) {
        const items = [];

        // 1. 자연 / 인프라 성향
        if (type.letters.nature === "N") {
            items.push("자연 풍경을 즐길 수 있는 장소와 산책 코스 찾아보기");
            items.push("여행지 날씨를 확인하고 야외 활동 준비하기");
        } else {
            items.push("대중교통, 쇼핑 구역, 실내 관광지 위치 확인하기");
            items.push("비가 오거나 날씨가 나쁠 때 갈 실내 장소 찾아보기");
        }

        // 2. 외향 / 내향 성향
        if (type.letters.social === "E") {
            items.push("함께 즐길 체험이나 활기찬 장소 일정에 넣기");
        } else {
            items.push("혼자 쉬거나 조용히 머물 수 있는 시간 확보하기");
        }

        // 3. 계획 / 즉흥 성향
        if (type.letters.planning === "P") {
            items.push("이동 경로와 예약 시간을 포함한 일정표 준비하기");
        } else {
            items.push("꼭 가고 싶은 곳만 정하고 자유 시간 남겨두기");
        }

        // 4. 음식 선호 / 비선호 성향
        if (type.letters.food === "F") {
            items.push("가고 싶은 맛집의 영업시간과 웨이팅 여부 확인하기");
        } else {
            items.push("관광 동선에 맞춰 간단히 식사할 장소 찾아두기");
        }

        // 5. 명소 선호 / 비선호 성향
        if (type.letters.sights === "L") {
            items.push("대표 관광지의 입장료와 예약 여부 확인하기");
        } else {
            items.push("현지 시장이나 골목 등 숨은 장소 찾아보기");
        }

        // 6. 모든 유형 공통 준비
        items.push("숙소 예약과 귀가 교통편 확인하기");

        return items;
    }


function buildRegionRecommendation(type) {
    // 32개 여행 유형별 추천 지역 및 대표 관광지
    const recommendations = {
        "자연·계획형 휴식가": {
            region: "강원",
            attraction: "인제 원대리 자작나무숲"
        },
        "자연·즉흥형 탐험가": {
            region: "인천",
            attraction: "무의도 하나개해수욕장"
        },
        "자연·미식형 식도락가": {
            region: "경기",
            attraction: "가평 아침고요수목원"
        },
        "자연·명소형 탐방가": {
            region: "순천",
            attraction: "순천만습지"
        },
        "자연·외향형 액티비티족": {
            region: "경주",
            attraction: "첨성대 & 대릉원"
        },
        "자연·내향형 힐링가": {
            region: "제주",
            attraction: "안돌오름 비밀의 숲"
        },
        "자연·해변 휴식가": {
            region: "강원",
            attraction: "강릉 경포해변"
        },
        "자연·로컬 탐험가": {
            region: "순천",
            attraction: "순천만국가정원"
        },
        "인프라·계획형 미식가": {
            region: "전주",
            attraction: "전주 한옥마을"
        },
        "인프라·즉흥형 탐험가": {
            region: "충청",
            attraction: "대전 성심당 문화원"
        },
        "인프라·명소형 문화가": {
            region: "여수",
            attraction: "돌산공원 & 돌산대교"
        },
        "인프라·외향형 핫플가": {
            region: "부산",
            attraction: "영도 흰여울문화마을"
        },
        "인프라·내향형 휴식가": {
            region: "서울",
            attraction: "성수동 연무장길"
        },
        "인프라·도심 미식가": {
            region: "서울",
            attraction: "DDP (동대문디자인플라자)"
        },
        "인프라·스트리트 탐험가": {
            region: "인천",
            attraction: "송도 트리플스트리트"
        },
        "인프라·녹지 휴식가": {
            region: "서울",
            attraction: "서울숲 곤충식물원"
        },
        "체계적 자연 치유가": {
            region: "강원",
            attraction: "설악산 권금성 케이블카"
        },
        "체계적 역사 탐방가": {
            region: "경주",
            attraction: "동궁과 월지"
        },
        "체계적 도심 관람가": {
            region: "경기",
            attraction: "과천 국립현대미술관"
        },
        "자유로운 미식 탐방가": {
            region: "부산",
            attraction: "해운대 블루라인파크"
        },
        "자유로운 해안 기행가": {
            region: "제주",
            attraction: "애월 해안도로"
        },
        "사교적 피크닉가": {
            region: "경기",
            attraction: "가평 자라섬 캠핑장"
        },
        "사교적 야경 미식가": {
            region: "여수",
            attraction: "낭만포차거리"
        },
        "사교적 도심 문화가": {
            region: "서울",
            attraction: "여의도 한강공원"
        },
        "차분한 산사 휴식가": {
            region: "충청",
            attraction: "공주 마곡사"
        },
        "차분한 정원 산책가": {
            region: "순천",
            attraction: "순천 문화의거리"
        },
        "차분한 고택 탐방가": {
            region: "전주",
            attraction: "경기전"
        },
        "전통 문화 미식가": {
            region: "전주",
            attraction: "전주 전통술박물관"
        },
        "전통 유적 탐험가": {
            region: "경주",
            attraction: "불국사"
        },
        "로컬 역사 미식가": {
            region: "충청",
            attraction: "부여 낙화암"
        },
        "액티브 자연 체험가": {
            region: "강원",
            attraction: "정선 병방치 짚와이어"
        },
        "감성 힐링 여행가": {
            region: "제주",
            attraction: "중문관광단지"
        }
    };

    const recommendation = recommendations[type.title];

    if (!recommendation) {
        console.error(
            "여행 유형 추천을 찾을 수 없습니다:",
            type.title
        );

        return { text: "추천 정보를 준비 중입니다.", query: "대한민국 여행" };
    }

    return {
        text: `${recommendation.region} | 대표 관광지: ${recommendation.attraction}`,
        query: `${recommendation.region} ${recommendation.attraction}`
    };
}

    function displayTravelResult() {
        const scores = calculateTravelScores();
        const type = determineTravelType(scores);

        
        // 유형 제목 표시
        byId("result-title").textContent = type.title;

        // 여행 스타일 알파벳 코드 표시
        const typeCodeElement = byId("result-type-code");

        if (typeCodeElement) {
            typeCodeElement.textContent = type.code
                .split("")
                .join(" · ");
        }


        // 유형별 고정 설명 표시
        const descriptionElement = byId("result-type-description");

        if (descriptionElement) {
            descriptionElement.textContent =
                travelTypeDescriptions[type.code]
                || "나만의 방식으로 여행을 즐기는 여행자";
        }

        // AI 팩폭 한마디 표시 (유형별 3개 중 랜덤 선택)
        byId("result-ai-comment").textContent =
            `"${buildTravelComment(type)}"`;

        // 추천 지역 표시 및 카카오맵 바로가기 버튼 동적 연동
        const regionInfo = buildRegionRecommendation(type);
        byId("result-region").textContent =
            `추천 지역: ${regionInfo.text}`;

        const kakaoMapBtn = byId("kakao-map-btn");
        if (kakaoMapBtn) {
            kakaoMapBtn.href = `https://map.kakao.com/?q=${encodeURIComponent(regionInfo.query)}`;
        }

        
        // 맞춤 체크리스트 표시
        const checklist = byId("result-checklist");
        checklist.innerHTML = "";

        buildTravelChecklist(type).forEach((item, index) => {
            const li = document.createElement("li");
            li.className = "checklist-item flex items-center space-x-2";

            const label = document.createElement("label");
            label.htmlFor = `checklist-item-${index}`;
            label.className = "flex items-center space-x-2 cursor-pointer w-full";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `checklist-item-${index}`;

            const text = document.createElement("span");
            text.textContent = item;

            checkbox.addEventListener("change", () => {
                li.classList.toggle("is-completed", checkbox.checked);
                updateChecklistProgress();
            });

            label.append(checkbox, text);
            li.appendChild(label);
            checklist.appendChild(li);
        });

        updateChecklistProgress();


        // 모든 결과 정보를 준비한 다음 결과 화면 표시
        byId("screen-intro").classList.add("hidden");
        byId("screen-question").classList.add("hidden");
        byId("screen-result").classList.remove("hidden");

        // 개발자 도구에서 결과 코드와 점수 확인
        console.log("여행 스타일 유형:", type.code, "축별 점수:", scores);
    }


    // 체크리스트 진행률 업데이트
    function updateChecklistProgress() {
        const checklist = byId("result-checklist");
        const countElement = byId("checklist-count");
        const progressBar = byId("checklist-progress-bar");
        const progressText = byId("checklist-progress-text");

        if (!checklist || !countElement || !progressBar || !progressText) {
            return;
        }

        const checkboxes = checklist.querySelectorAll(
            'input[type="checkbox"]'
        );
        const total = checkboxes.length;
        const completed = checklist.querySelectorAll(
            'input[type="checkbox"]:checked'
        ).length;

        const percentage = total === 0
            ? 0
            : Math.round((completed / total) * 100);

        countElement.textContent = `${completed} / ${total}`;
        progressBar.style.width = `${percentage}%`;

        if (completed === total && total > 0) {
            progressText.textContent = "🎉 여행 준비 완료! 즐거운 여행 되세요.";
        } else if (completed === 0) {
            progressText.textContent = "하나씩 체크하며 여행을 준비해 보세요.";
        } else {
            progressText.textContent =
                `여행 준비 ${percentage}% 완료! 조금만 더 준비해 봐요.`;
        }
    }



    // 체크리스트 초기화 버튼
    byId("checklist-reset-btn").addEventListener("click", () => {
        const checkboxes = byId("result-checklist").querySelectorAll(
            'input[type="checkbox"]'
        );

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.closest("li").classList.remove("is-completed");
        });

        updateChecklistProgress();
    });

    // 체크리스트 복사 버튼
    byId("checklist-copy-btn").addEventListener("click", async () => {
        const checkboxes = byId("result-checklist").querySelectorAll(
            'input[type="checkbox"]'
        );

        const lines = Array.from(checkboxes).map(checkbox => {
            const text = checkbox.closest("label").querySelector("span").textContent;
            return `${checkbox.checked ? "[x]" : "[ ]"} ${text}`;
        });

        const copyText = lines.join("\n");

        try {
            await navigator.clipboard.writeText(copyText);
            alert("체크리스트를 복사했어요!");
        } catch (error) {
            console.error("체크리스트 복사 실패:", error);
            alert("복사에 실패했어요. 브라우저 권한을 확인해 주세요.");
        }
    });





    function resetTravelTest() {
        byId("screen-result").classList.add("hidden");
        byId("screen-question").classList.add("hidden");
        byId("screen-intro").classList.remove("hidden");
        questionIndex = 0;
        selectedAnswer = null;
        transitionLock = false;
        travelAnswers.fill(null);
    }

    // 개발자용: 무작위 답변으로 결과 화면 바로 보기
    function showRandomTravelResult() {
        // 18개 질문에 1~5점 무작위 답변 설정
        travelAnswers.forEach((_, index) => {
            travelAnswers[index] = Math.floor(Math.random() * 5) + 1;
        });

        // 이전 화면을 숨기고 결과 표시
        byId("screen-intro").classList.add("hidden");
        byId("screen-question").classList.add("hidden");

        displayTravelResult();
    }

    // 기존 HTML의 onclick 속성이 호출하는 함수 이름과 연결합니다.
    window.startTest = beginTravelTest;
    window.loadQuestion = displayTravelQuestion;
    window.renderOptions = displayTravelQuestion;
    window.answerQuestion = recordTravelAnswer;
    window.showResult = displayTravelResult;
    window.restartTest = resetTravelTest;
    window.showRandomTravelResult = showRandomTravelResult;
})();


