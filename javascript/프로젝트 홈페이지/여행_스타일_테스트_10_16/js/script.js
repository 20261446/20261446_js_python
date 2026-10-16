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
        social:   { first: "E", second: "I", firstName: "외향", secondName: "내향" },
        planning: { first: "P", second: "S", firstName: "계획", secondName: "즉흥" },
        food:     { first: "F", second: "X", firstName: "음식 선호", secondName: "음식 비선호" },
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
            label.className = `text-xs sm:text-sm ${isSelected ? "font-bold text-orange-600" : "font-semibold text-slate-700"} mt-2`;
            label.textContent = option.label;

            const sub = document.createElement("span");
            sub.className = "text-[10px] sm:text-xs text-slate-400 mt-0.5";
            sub.textContent = option.sub;

            button.append(circle, label, sub);
            button.addEventListener("click", () => recordTravelAnswer(option.score));
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
            label.className = `text-xs sm:text-sm ${isSelected ? "font-bold text-orange-600" : "font-semibold text-slate-700"} mt-2`;
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



    

    function determineTravelType(scores) {
        const letters = {};
        const names = [];
        axisOrder.forEach(axis => {
            const setting = axisSettings[axis];
            // 3문항 합계는 3~15점. 10점 이상은 첫 성향, 9점 이하는 반대 성향.
            const chooseFirst = scores[axis] >= 10;
            letters[axis] = chooseFirst ? setting.first : setting.second;
            names.push(chooseFirst ? setting.firstName : setting.secondName);
        });
        return {
            code: axisOrder.map(axis => letters[axis]).join(""),
            letters,
            names,
            title: `${names.join(" · ")}형 여행자`
        };
    }

    function buildTravelComment(type) {
        const comments = [];
        comments.push(type.letters.nature === "N"
            ? "자연 보러 왔다면서 예쁜 풍경 앞에서 시간 가는 줄 모르는 타입."
            : "여행은 동선과 편리함이 중요해서 이동이 불편하면 흥미가 급격히 떨어지는 타입.");
        comments.push(type.letters.social === "E"
            ? "사람들과 신나게 놀다 보면 숙소에 돌아와서야 체력이 바닥난 걸 깨닫는 편."
            : "여행에서도 혼자 충전할 시간이 필요해서 일정이 너무 빡빡하면 피곤해지는 편.");
        comments.push(type.letters.planning === "P"
            ? "계획표를 미리 만들어야 마음이 편하고, 일정대로 움직이고 싶어 하는 편."
            : "계획은 참고용일 뿐, 더 끌리는 장소가 생기면 바로 방향을 바꾸는 편.");
        comments.push(type.letters.food === "F"
            ? "관광지를 하나 놓쳐도 맛집은 놓치면 안 되는 사람."
            : "맛집 웨이팅보다 그 시간에 한 곳이라도 더 보고 싶은 사람.");
        comments.push(type.letters.sights === "L"
            ? "유명한 곳에 왔는데 인증 사진이나 방문 기록이 없으면 아쉬운 편."
            : "다들 가는 명소보다 우연히 발견한 장소를 더 특별하게 기억하는 편.");

        const chosen = comments.filter((_, index) => index === 0 || type.code.charCodeAt(index) % 2 === 0);
        return chosen.slice(0, 2).join(" ");
    }

    function buildTravelChecklist(type) {
        const items = [];
        items.push(type.letters.nature === "N"
            ? "자연 풍경을 즐길 수 있는 장소와 산책 코스 찾아보기"
            : "대중교통, 쇼핑 구역, 실내 관광지 위치 확인하기");
        items.push(type.letters.social === "E"
            ? "함께 즐길 체험이나 활기찬 장소를 일정에 넣기"
            : "혼자 쉬거나 조용히 머물 수 있는 시간을 확보하기");
        items.push(type.letters.planning === "P"
            ? "이동 시간과 예약 시간을 포함한 일정표 준비하기"
            : "꼭 가고 싶은 곳만 정하고 나머지 일정은 여유롭게 비워두기");
        items.push(type.letters.food === "F"
            ? "가고 싶은 맛집의 영업시간과 웨이팅 여부 확인하기"
            : "동선에 맞춰 간단히 식사할 수 있는 곳 찾아두기");
        items.push(type.letters.sights === "L"
            ? "대표 관광지의 입장료와 예약 여부 확인하기"
            : "현지 시장이나 골목 등 숨은 장소 찾아보기");
        return items;
    }

    function buildRegionRecommendation(type) {
        // 지역별/유형별 최종 추천은 팀에서 확정한 자료가 나오면 교체할 임시 예시입니다.
        if (type.letters.nature === "N" && type.letters.planning === "P") return "강원도 — 자연 풍경과 산책 코스";
        if (type.letters.nature === "N") return "제주도 — 바다와 자연 중심 여행";
        if (type.letters.food === "F") return "전주 — 지역 음식과 먹거리 탐방";
        if (type.letters.sights === "L") return "서울 — 대표 명소와 도심 관광";
        return "부산 — 도심과 해변을 함께 즐기는 여행";
    }

    function displayTravelResult() {
        byId("screen-question").classList.add("hidden");
        byId("screen-result").classList.remove("hidden");

        const scores = calculateTravelScores();
        const type = determineTravelType(scores);

        byId("result-title").textContent = type.title;
        byId("result-ai-comment").textContent = `"${buildTravelComment(type)}"`;
        byId("result-region").textContent = `추천 지역: ${buildRegionRecommendation(type)}`;

        const checklist = byId("result-checklist");
        checklist.innerHTML = "";
        buildTravelChecklist(type).forEach(item => {
            const li = document.createElement("li");
            li.className = "flex items-center space-x-2";
            const bullet = document.createElement("span");
            bullet.className = "w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0";
            const text = document.createElement("span");
            text.textContent = item;
            li.append(bullet, text);
            checklist.appendChild(li);
        });

        // 원본 HTML에 결과 코드 요소가 없을 수 있으므로, HTML 구조를 임의 변경하지 않습니다.
        console.log("여행 스타일 유형:", type.code, "축별 점수:", scores);
    }

    function resetTravelTest() {
        byId("screen-result").classList.add("hidden");
        byId("screen-question").classList.add("hidden");
        byId("screen-intro").classList.remove("hidden");
        questionIndex = 0;
        selectedAnswer = null;
        transitionLock = false;
        travelAnswers.fill(null);
    }

    // 기존 HTML의 onclick 속성이 호출하는 함수 이름과 연결합니다.
    window.startTest = beginTravelTest;
    window.loadQuestion = displayTravelQuestion;
    window.renderOptions = displayTravelQuestion;
    window.answerQuestion = recordTravelAnswer;
    window.showResult = displayTravelResult;
    window.restartTest = resetTravelTest;
})();
