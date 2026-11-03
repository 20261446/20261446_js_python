from tkinter import *
from tkinter import messagebox
window = Tk()

##window.title("윈도창 연습")
##window.geometry("600x300")
##window.resizable(width = FALSE, height = FALSE)



##label1 = Label(window, text = "COOKBOOK~~Python을")
##label2 = Label(window, text = "열심히" , font = ("궁서체", 30), fg = "blue")
##label3 = Label(window, text = "공부 중 입니다", bg = "royalblue", width = 20, height = 5, anchor = SE)
##saddlebrown,darkred,tomato,deeppink,mediumvioletred,royalblue,mediumslateblue
##label1.pack()
##label2.pack()
##label3.pack()


##photo = PhotoImage(file = "python/img/cat-cat-dance.gif")
##label1 = Label(window,image = photo)

##label1.pack()


##window.mainloop()

##from PIL import Image
##img = Image.open("cat-cat-dance.gif")
##img.show()


##def myFunc():
    ##messagebox.showinfo("알림", "버튼이 클릭되었습니다.")

##window = Tk()

##photo = PhotoImage(file = "python/img/cat-cat-dance.gif")
##button1 = Button(window, image = photo, command = myFunc)
##button1.pack()
##window.mainloop()

def myFunc():
    if chk.get() == 0:
        messagebox.showinfo("알림", "파이썬이 해제되었습니다.")
    else:
        messagebox.showinfo("알림", "파이썬이 선택되었습니다.")

def myFunc1():
    if chk1.get() == 0:
        messagebox.showinfo("알림", "C++가 해제되었습니다.")
    else:
        messagebox.showinfo("알림", "C++가 선택되었습니다.")

def myFunc2():
    if chk2.get() == 0:
        messagebox.showinfo("알림", "JavaScript가 해제되었습니다.")
    else:
        messagebox.showinfo("알림", "JavaScript가 선택되었습니다.")

chk = IntVar()
chk1 = IntVar()
chk2 = IntVar()

cb1 = Checkbutton(window, text = "파이썬", variable = chk, command = myFunc)
cb2 = Checkbutton(window, text = "C++", variable = chk1, command = myFunc1)
cb3 = Checkbutton(window, text = "JavaScript", variable = chk2, command = myFunc2)

cb1.pack()
cb2.pack()
cb3.pack()

window.mainloop()