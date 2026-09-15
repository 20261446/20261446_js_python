##a = input()
##b = input()

##print(a*b)
##print(a/b)
##print(a+b)
##print(a-b)

##data =  "안녕 \n하세요? \n파이썬!"
##print(data)

# import turtle
# t = turtle.Turtle()

# t.speed(3)
# t.pensize(10)
# t.pencolor("deepskyblue")
# t.shape("arrow")
# t.shapesize(2)

# t.forward(200)
# t.right(144)
# t.forward(200)
# t.right(144)
# t.forward(200)
# t.right(144)
# t.forward(200)
# t.right(144)
# t.forward(200)
# t.right(144)

# turtle.done()


import turtle ##거북이 그래픽 라이브러리를 불러옵니다.
import random ##랜덤 값 생성을 위한 라이브러리.


##함수 선언 부분
def screenLeftClick(x, y):
    global r, g, b
    turtle.pencolor((r, g, b))
    turtle.pendown()
    turtle.goto(x, y)

def screenRightClick(x, y):
    ##수정
    global r, g, b
    turtle.pencolor((r, g, b))
    ##수정
    turtle.penup()
    turtle.goto(x, y)

def screenMidClick(x, y):
    global r, g, b
    tsize = random.randrange(1, 10)
    turtle.shapesize(tsize)
    r = random.random()
    g = random.random()
    b = random.random()


psize = 10
r, g, b = 0.0, 0.0, 0.0


turtle.title("거북이로 그림 그리기")
turtle.shape("turtle")
turtle.pensize(psize)


turtle.onscreenclick(screenLeftClick, 1)
turtle.onscreenclick(screenMidClick, 2)
turtle.onscreenclick(screenRightClick, 3)

turtle.done()