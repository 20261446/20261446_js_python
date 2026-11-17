from tkinter import *
from tkinter import messagebox

def clickLeft(event):
    messagebox.showinfo("알림", "왼쪽 버튼 더블클릭 했습니다")

window = Tk()

window.bind("<Double-Button-1>", clickLeft)

window.mainloop()

# from tkinter import *


# def clickMouse(event):
#     txt = ""
#     if event.num == 1:
#         txt = "왼쪽 버튼 클릭이 ("
#     elif event.num == 3:
#         txt += "오른쪽 버튼 클릭이 ("

#     txt += str(event.y) + "," +str(event.x) + ")에서 클릭됨"
#     label1.configure(text = txt)

# window = Tk()
# window.geometry("400x400")

# label1=Label(window, text="이곳이 바뀜")

# window.bind("<Button>",clickMouse)

# label1.pack(expand=1,anchor=CENTER)
# window.mainloop()





from tkinter import *
from tkinter import messagebox

def keyEvent(event):
    messagebox.showinfo("키보드 이벤트","눌린 키 : Shift + 아래방향키")

window = Tk()

window.bind("<Shift-Down>", keyEvent)

window.mainloop()

