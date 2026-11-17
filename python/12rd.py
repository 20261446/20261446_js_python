from tkinter import * #파이썬 기본 GUI 제작도구인 Tkinter 모든 기능 사용
from tkinter import messagebox
from tkinter.filedialog import askopenfilename

def func_open():
    messagebox.showinfo("메뉴선택","열기 메뉴를 선택함")
    filepath = askopenfilename(
    title="gif 이미지 로드",
    filetypes=(
        ("GIF 이미지", "*.gif"),
        )
    )
    tk_img = PhotoImage(file=filepath)
    image_label.config(image=tk_img)
    image_label.image = tk_img


def func_exit():
    window.quit()
    window.destroy()


window = Tk() #기본이 되는 윈도우창 생성
window.title("Gif 뷰어")
image_label = Label(window)
image_label.pack()


mainMenu = Menu(window) #생성한 윈도우창에 부착할 메인메뉴 객체를 생성
window.config(menu = mainMenu) #창의 속성을 변경하여 mainmenu를 창에 넣음



fileMenu = Menu(mainMenu) #메인메뉴 아래 들어갈 하위메뉴를 생성
mainMenu.add_cascade(label = "파일",menu=fileMenu) #메인메뉴바에 파일이라는 이름의 메뉴를 넣음

fileMenu.add_command(label="열기",command = func_open) #하위메뉴에 클릭가능한 열기 메뉴 추가
fileMenu.add_separator() #하위메뉴에 구분선 추가
fileMenu.add_command(label = "종료",command = func_exit) #하위메뉴에 클릭가능한 종료 메뉴 추가



viewMenu = Menu(mainMenu)
mainMenu.add_cascade(label="보기", menu=viewMenu)

viewMenu.add_command(label="축소")
viewMenu.add_command(label="확대")



homeMenu = Menu(mainMenu)
mainMenu.add_cascade(label="홈", menu=homeMenu)

homeMenu.add_command(label="저장")
homeMenu.add_command(label="선택")
homeMenu.add_command(label="찾기")




window.mainloop() #화면에 윈도우창 지속



