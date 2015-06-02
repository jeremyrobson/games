#include <iostream>
#include <iomanip>
#include <string>
#include <vector>
#include <time.h>
#include <algorithm>

using namespace std;

class Card
{
public:
    string face;
    int value;
    string suit;
    string name;
    static string names[13];
    static string faces[13];
    static int values[13]; 
    static string suits[4]; 
    Card(int index, int suit);
    ~Card();
};

Card::Card(int index, int suitindex)
{
    face = faces[index];
    value = values[index];
    suit = suits[suitindex];
    name = names[index] + " of " + suits[suitindex];
}

Card::~Card() { }

string Card::names[] = { "Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King" };
string Card::faces[] = { "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };
int Card::values[] = { 11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10 };
string Card::suits[] = { "Spades", "Hearts", "Clubs", "Diamonds" };

int get_total(vector<Card> &hand)
{
    int total = 0;
    for each(Card c in hand)
    {
        total += c.value;
    }
    return total;
}

class Deck
{
public:
    Deck();
    ~Deck();
    vector<Card> cards;
    void shuffle();
    Card draw();
    string toString();
};

Deck::Deck()
{
    for (int i = 0; i < 13; i++)
    {
        for (int j = 0; j < 4; j++) {
            Card c(i, j);
            cards.push_back(c);
            //cout << c.name << endl;
        }
    }
}

Deck::~Deck() { }

void Deck::shuffle()
{
    random_shuffle(cards.begin(), cards.end());
}

Card Deck::draw()
{
    Card c = cards.back();
    cards.pop_back();
    return c;
}

string Deck::toString()
{
    string s = "Cards: ";
    for each(Card c in cards)
    {
        s += c.name + "\n";
    }
    return s;
}

class Player
{
public:
    int number;
    Player(int num, Deck &d);
    ~Player();
    int total;
    void deal(Deck &d);
    vector<Card> hand;
    string toString();
};

Player::Player(int num, Deck &d)
{
    number = num;
    hand.push_back(d.draw());
    hand.push_back(d.draw());
    total = get_total(hand);
}

Player::~Player() { }

void Player::deal(Deck &d)
{
    hand.push_back(d.draw());
    total = get_total(hand);
}

string Player::toString()
{
    string s = "Player ";
    s += to_string(number);
    s += "'s hand: ";
    for each(Card c in hand)
    {
        s += c.name + "\n";
    }
    s += "Current hand total: ";
    s += to_string(total);
    s += "\n\n";
    return s;
}

int main()
{
    Deck d;
    d.shuffle();

    Player p1(1, d); //player
    Player p2(2, d); //dealer

    string input;
    int gamestatus = 0;

    cout << "Welcome to Black Jack!" << endl;

    while (true) {
        cout << "----------------------------------" << endl;
        cout << p1.toString() << endl;
        cout << p2.toString() << endl;

        if (gamestatus > 0) break;

        cout << "'Hit' or 'stay'? ";
        getline(cin, input);

        if (input == "hit")
        {
            p1.deal(d);
            if (p1.total > 21)
            {
                gamestatus = 1;
                break;
            }
            else if (p1.total == 21)
            {
                gamestatus = 3;
                break;
            }
        }
        else if (input == "stay")
        {
            gamestatus = 2;
            break;
        }
        else
        {
            cout << "Invalid command!" << endl;
        }
    }

    cout << p1.toString() << endl;
    cout << p2.toString() << endl;

    switch (gamestatus)
    {
    case 1:
        cout << "Payer busts! You lose!";
        break;
    case 2:
        cout << "Dealer busts! You win!";
        break;
    case 3:
        cout << "You got 21 Black Jack! You win!";
        break;
    }
    cout << endl << endl;

    system("pause");

    return 0;
}
