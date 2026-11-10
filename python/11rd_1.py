from tkinter import *
from tkinter import messagebox

def clickLeft(event):
    messagebox.showinfo("알림", "왼쪽 버튼 더블클릭 했습니다")

window = Tk()

window.bind("<Double-Button-1>", clickLeft)

window.mainloop()