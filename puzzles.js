const PUZZLES = `
c1m
  k
  #  k
#.#####
lo###k
 ####o
 k##o.l
     l

2
lok
 .

3
lkol
o  .
k  .

4
.k
lok
ol
k

5
  l
  o
 k.
look.
 l.
  k

6
olkolkok

7
k
o.l.o.k
kloko.l
l

8
lol
o o
kolok
  o
  k

c2m
  k   k
  a l#.
 tl####ak
##t#####
  l#####
 #####.
  ####o
  t .#l

9
tltlakak
...
.

10
  . t
  k l
  a .
kol...l
  t a
    k

11
ktl
llk
oao.
lkk.

12
  k
 ..
tloak
kol.
 kl

13
 lok
tl.ak
.kal.t
k...ol

14
 .
 tt
tll
laa
akk
kol
 .

15
 .k
kallt
k.o.o.l
 lok
  l

16
  k
  o l
  lok
tlakook
  lok

17
l      l
ttllaakk
olokoako
k k k  k

c3m
######a
######th
######j
######h
######tm
mhatjma
 j

18
ta
uuu
uuu

19
 hhh
tgtga
 gag

20
salasok
   t

21
te.a
dt.a
deta

22-1
t
a

22-2
tamm
lomk

23
  tl
  lo
tltaak
  ak
  k

24
t.t.lak
.......
tlalok

25
   t
  flzd
tlzaak
 lok

26
ttlaklak
  lok
  tlak

27
mjkkj
lotak
 daad
  llj
  ttd
  m

c4m
  t#lx
xo###x
k####
x###x
 x##x
 x.a

28
loxk

29
tlx
kax

30
l k
xoxok
  l

31-1
l
oxk

31-2
     t
lx.xok
     a

31-3
t k
.lox
a xx

32
  tx
xk.l.t
axax

33
    k
 taka
x..ax
ltlx
t

34
xxx
xoxk
xvlt
  a

35
txlt
l.  a
o.  .
kxak.
xolkx

36
txok
l..xlt
 xax
 k a

37
  ttk
  ll.
faxxxok
   z.
   ao
   kl

38
 t
 l
x.t.kt
..a.bf
xta.lxa
 ..x.ox
 x...kx
   x.x

c5m
#######
#######
#######
#######
#######
#######
#######
bates.y
t.abe

39
be.
l.k

40
   a
 bek
 eb.
ttl.

41
blok.e

42
  be
kee..l
   ..

43
   .
  .e.
keablat.
 b   t.
     .

44
 a
 st
b.lste
.xxoak

45
.....
 blee
 boe
 bk.e.
   b

46
.xlk
.o.a
bxkl
e  t

47
..ee...
te.pbb.
t......
bbe.okb
   e

c6m
  #
  #
  #
  #
  #
  #
  #####
 ##xox##
 #a##.t#
#########
#########
 #######
  kaltv
   k m
-
      x#
     l###
     ####
      ##

48
tlx
  x
lox
  xx
 kax

49
ttb
l..
aae
-
kd
.

50
a. .bet
tl.k  v

51
.x.x
xlx
t a
bekx

52
ttusx
l   a
x   x
k   a
xoklk

53
.lbx
   e
.  tt
   ..
l   a
xokak

54
tl ak
xa k.
  .
xl te
lz bx

55
.k b x
e a l x
 t u k
b u u b
 t e a
x o e .
 x l .

c7m
   xol
k
o
x
lolx

56
       .
      .
lolo .
    .
   .
  .
 .

57
 l...n
 o..
 l.r
 ta
 o
g

58-1
 .
  .
   .
lolo.

58-2
lolk .
  o .
  l.
  o

58-3
lolo

59
 x..tk
al. t.
 ol ol
 a.  a
 k.tlx

60
 . l .
   t
okoxlak
   l
 . o .
   l

61
    a
xlx .
xox.t

62
a. .t
 l.
 xox
lolxk

63
xlxoxa
o l l
xlxox
o o .
xlx..
    .
    .
    t

64
xtlox
lxakx
.oaa.
lka.
xx.t
-
.

65
t
.o ez kx
l      o
b  j g
l y v  k
t v j  l
t   y  a
t      l
xlak a x
       a

c8m
   h
r?
  ? a
 ?

66
lo?
.

67
  tr?
  lrr
as?zt
  k

68
.???k

69
?
 ? y
  g
     a
   katlt

70
l
?okflak
     ch

71
   l
  jo
 jl.
jbeo
 j k
   o

72
 o.
 lo ?
..e?x

73
   a
  x x
tlt  ak
   ?xz

74
x.x
be
x x

75
x?x

76
x?x
 z
x?x
 s

77
 x?xv
 u pc
 x?x
 x x
gx?x

78
butike
 xxxx
 .  ?
 xxxx

79
 a
dsv
lrk
x?x
x?x
 t

80
e
b.k.
baze
b.em
blse
b.e.
ltok
`;

const PUZZLE_SELECT = {};
for (let puzzle of PUZZLES.slice(1, -1).split("\n\n")) {
    let index = puzzle.indexOf("\n");
    let key = puzzle.slice(0, index);
    let grid = puzzle.slice(index + 1).replaceAll("-", "");
    PUZZLE_SELECT[key] = grid;
}