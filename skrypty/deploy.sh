#!/bin/bash

# Sprawdzenie, czy podano wiadomość commita
if [ -z "$1" ]; then
  echo "Użycie: ./scripts/deploy.sh \"Wiadomość Twojego commita\"" # Zaktualizowana ścieżka
  exit 1
fi

COMMIT_MESSAGE=$1
BRANCH_NAME="dev" # Ustaw gałąź docelową

echo "--- Rozpoczęcie automatycznego pusha CI/CD ---"

# 1. Dodanie wszystkich zmian do śledzenia
echo "1. git add ."
git add .

# 2. Utworzenie commita
echo "2. git commit -m \"$COMMIT_MESSAGE\""
if git commit -m "$COMMIT_MESSAGE"; then
    echo "Commit pomyślny."
else
    echo "Błąd: Commit nieudany (możliwe, że nie było zmian do zatwierdzenia)."
    exit 1
fi

# 3. Wypchnięcie zmian do gałęzi docelowej, co uruchomi GitHub Actions
echo "3. git push origin $BRANCH_NAME"
git push origin $BRANCH_NAME

if [ $? -eq 0 ]; then
    echo "--- Sukces! Zmiany wypchnięte, GitHub Actions uruchomione na gałęzi $BRANCH_NAME. ---"
else
    echo "--- BŁĄD podczas pusha. Sprawdź swoje połączenie i uprawnienia. ---"
fi