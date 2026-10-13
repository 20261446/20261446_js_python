# aa = [0,0,0,0,0] #aa라는 변수를 0으로 초기화
# hap = 0 #hap이라는 변수를 0으로 초기화

# aa[0] = int(input("첫번째 수를 입력하세요.")) #사용자에게 aa[0]에 첫번째 정수를 입력받음
# aa[1] = int(input("두번째 수를 입력하세요.")) #사용자에게 aa[1]에 두번째 정수를 입력받음
# aa[2] = int(input("세번째 수를 입력하세요.")) #사용자에게 aa[2]에 세번째 정수를 입력받음
# aa[3] = int(input("네번째 수를 입력하세요.")) #사용자에게 aa[3]에 네번째 정수를 입력받음
# aa[4] = int(input("다섯번째 수를 입력하세요.")) #사용자에게 aa[4]에 다섯번째 정수를 입력받음

# # 사용자가 입력한 다섯개의 정수를 합산하여 hap에 저장
# hap = aa[0] + aa[1] + aa[2] + aa[3] + aa[4]

# print("합계 : %d" %hap) #hap의 값을 정수형으로 출력






# aa = [] #aa라는 변수를 빈 리스트로 생성
# for i in range(0,10):
#     aa.append(0)
# hap = 0

# for i in range(0, 10):
#     aa[i] = int(input(str(i+1) + "번째 수를 입력하세요."))

# hap = aa[0] + aa[1] + aa[2] + aa[3] + aa[4] + aa[5] + aa[6] + aa[7] + aa[8] + aa[9]

# print("합계 : %d" %hap)





# aaa = []
# bbb = []
# value = 0

# for i in range(0, 100):
#     aaa.append(value)
#     value += 2

# for i in range(0, 100):
#     bbb.append(aaa[99-i])

# print("bbb[0]에는 %d이, bbb[99]에는 %d이 입력됩니다." %(bbb[0], bbb[99]))




# mylist = [30,10,20]
# print("현재 리스트 : %s" %mylist)

# mylist.append(40)
# print("append(40) 후의 리스트 : %s" %mylist)

# print("pop()으로 추출한 값 : %s" %mylist.pop())
# print("pop() 후의 리스트 : %s" %mylist)

# mylist.sort()
# print("sort() 후의 리스트 : %s" %mylist)

# mylist.reverse()
# print("reverse() 후의 리스트 : %s" %mylist)

# print("20값의 위치 : %d" %mylist.index(20))

# mylist.insert(2, 222)
# print("insert(2, 222) 후의 리스트 : %s" %mylist)

# mylist.remove(222)
# print("remove(222) 후의 리스트 : %s" %mylist)

# mylist.extend([77, 88, 77])
# print("extend([77, 88, 77]) 후의 리스트 : %s" %mylist)

# print("77값의 개수 : %d" %mylist.count(77))


# list1 = []
# list2 = []
# value = 0
# for i in range(0, 4):
#     for k in range(0, 5):
#         list1.append(value)
#         value += 3
#     list2.append(list1)
#     list1 = []

# for i in range(0, 4):
#     for k in range(0, 5):
#         print("%3d" %list2[i][k], end="")
#     print("")










# ss='Python is Easy. 그래서 programming이 재미있습니다.'
# ss.center(80, '#')


instr = "<<<파<<이>>썬>>>"
outstr = ""

for i in range(0, len(instr)):
    if instr[i] != "<" and instr[i] != ">":
        outstr += instr[i]

print("원래 문자열==> " + instr)
print("공백 삭제 문자열==> " + outstr)
