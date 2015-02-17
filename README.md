Romain Dauby

Félix Wattez

#BeerpongJs
##Introduction
Nous avons développé un jeu de beerpong en 3D. Les règles sont simples. Le premier joueur qui n’a plus de gobelet a perdu. Chaque fois qu’un joueur envoi la balle dans un gobelet de l’adversaire, celui-ci le perd.

Accéder au jeu
Joueur seul : [http://beerpong.epsi.ovh](http://beerpong.epsi.ovh)
Multi-joueur : [http://beerpong-multi.epsi.ovh](http://beerpong-multi.epsi.ovh) 

##Outils de développement
* Trello
https://trello.com/ Permet d’avoir un kanban (agile) sur internet. Nous avons implémenté 4 états : todo, doing, done, red thread. Fil rouge car il y a des bugs difficilements reproductibles et qui donc doivent être résolus au fur et à mesure de la rencontre de ceux-ci.
Cet outil permet d’avoir le backlog des choses à développer, de savoir qui travaille sur quelle fiche et donc ne pas être à plusieurs sur la même fonctionnalité et de savoir qu’elles sont les fiches finies. Etant 2 développeurs, nous avons décidé de valider les fiches terminées par l’autre en les archivant. Cela permet une double validation puis la fiche disparaît du kanban.
* Git
Avec utilisation de https://bitbucket.org. Permet de gérer un versionning du code source du projet.
* Chrome 
Pour lancer l’application et utilisation sa console de debug javascript.
* npm
Pour la gestion de paquets côté serveur : permet l’installation très facile (commande npm install) de librairies que l’on spécifie dans le fichier package.json.

##Langages
* HTML5
* Javascript
* XML

##Libraries utilisées
* three.js : permet le rendu 3D
* physijs : plugin physique pour three.js
* stats.js : permet d’afficher des statistiques sur les performances de l’application
* OrbitControl.js : permet de déplacer la caméra sur la scène de façon simple avec la souris
* ColladaLoader.js : permet de charger un objet 3D sur la scène depuis un fichier xml rendu par blender
* socket.io : permet l’échange de données temps réel à travers un serveur intermédiaire en utilisant les websockets. Il y a une partie cliente et une serveur

##Server
Le serveur intermédiaire qui permet l’échange de données est un node.js. La librairie socket.io est utilisée sur celui-ci.

##Difficultés
1. La physique
 La physique implémentée dans la librairie physijs ne s’applique pas à toutes les formes qui sont dessinables par three.js. Il y a une liste exhaustive : https://github.com/chandlerprall/Physijs/wiki/Basic-Shapes .
 Il n’est donc pas possible d’ajouter une physique physijs correcte sur les gobelets importés par ColladaLoader.js. La seule physique que l’on pouvait donner au gobelet est une physique de type BoxMesh mais la balle ne peut pas entrer dans le gobelet...
 Pour créer une physique pour chaque gobelet, nous avons dessinés des petits murs (au nombre de 8) autour de chaque gobelet. Cela forme donc un octogone autour des gobelets. Plus on ajoute de petits murs, mieux sera dessiné la physique autour du gobelet. Mais nous avons décidé que 8 murs sont suffisants pour que le gameplay soit sympa.
 Les petits murs sont rendus transparents à l’aide d’une texture png transparente.
 Donc chaque fois qu’un gobelet est supprimé de la scène, il faut supprimer les 8 petits murs autour.

2. Le multi-joueur
 40h de projet c’est court. Nous avons donc décidé de ne pas pousser trop loin dans ses fonctionnalités le mode multi-joueur.
 En effet la première difficulté réside dans la synchronisation des clients entre eux. Car ils possèdent le même code source lorsqu’ils lancent l’application. Il faut donc que ce soit le serveur qui donne la main à tel ou tel joueur.
 De plus actuellement le serveur accèpte un nombre illimité (dans la mesure qu’il tienne la charge) de connexions. Les joueurs sont pairés 2 à 2. Le premier joueur à se connecter sera pairé avec le second, le troisième avec le quatrième etc…
 Si un joueur quitte la partie, le joueur restant sera mis en fin de liste et sera pairé avec le prochain joueur connecté.

##Extras
Dans une partie, si le joueur appuie sur la touche C, une fenêtre de chat s’ouvre. Il peut donc discuter avec son adversaire et tous les joueurs connectés au chat.
