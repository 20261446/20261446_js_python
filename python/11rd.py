# from tkinter import *
# window = Tk()

# btnList = [None] * 3

# for i in range(0,3):
#     btnList[i] = Button(window, text = "버튼" + str(i+1))

# for btn in btnList:
#     btn.pack(side = BOTTOM, fill = X, padx = 10, pady = 10, ipadx = 10, ipady = 10)

# window.mainloop()



from tkinter import *
from PIL import Image, ImageTk, ImageOps

window = Tk()
window.geometry("210x210")

image_path = "python/images/gif1.gif" 

img = Image.open(image_path)
img_resized = ImageOps.contain(img, (200,200))
tk_img = ImageTk.PhotoImage(img_resized)

label = Label(window, image=tk_img)
label.image = tk_img

window.mainloop()

# btnList = [None] * 4
# fnameList = ["gif1.gif", "gif2.gif", "gif3.gif", "gif4.gif"]
# photoList = [None] * 4
# i,k = 0,0
# xPos,yPos = 0,0
# num = 0


# for i in range(0,4):
#     photoList[i] = PhotoImage(file = "python/images/" + fnameList[i])
#     btnList[i] = Button(window, image = photoList[i])

# for i in range(0,2):
#     for k in range(0,2):
#         btnList[num].place(x = xPos, y = yPos)
#         num += 1
#         xPos += 70
#     xPos = 0
#     yPos += 70

window.mainloop()