from tkinter import *
from tkinter.filedialog import askopenfilename


def func_open():
    filepath = askopenfilename(
        title = "gif 이미지 로드",filetypes = ("gif이미지","*.gif")
    )

    tk_img = PhotoImage(filepath)

    image_label.config(image=tk_img)
    image_label.image = tk_img



window = Tk()
window.title("Gif 뷰어")
