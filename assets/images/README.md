# Assets de Imagens

Este diretório contém as imagens do site. **Nota**: Por direitos autorais, as imagens oficiais de Persona 5 Royal não estão incluídas neste repositório.

## Estrutura Necessária

```
assets/images/
├── characters/           # 9 Phantom Thieves
│   ├── joker.jpg
│   ├── ryuji.jpg
│   ├── ann.jpg
│   ├── morgana.jpg
│   ├── yusuke.jpg
│   ├── makoto.jpg
│   ├── futaba.jpg
│   ├── haru.jpg
│   ├── akechi.jpg
│   └── kasumi.jpg
├── confidants/           # 22 Confidantes
│   ├── fool.jpg
│   ├── magician.jpg
│   ├── priestess.jpg
│   ├── empress.jpg
│   ├── emperor.jpg
│   ├── hierophant.jpg
│   ├── lovers.jpg
│   ├── chariot.jpg
│   ├── justice.jpg
│   ├── hermit.jpg
│   ├── fortune.jpg
│   ├── strength.jpg
│   ├── hanged.jpg
│   ├── death.jpg
│   ├── temperance.jpg
│   ├── devil.jpg
│   ├── tower.jpg
│   ├── star.jpg
│   ├── moon.jpg
│   ├── sun.jpg
│   ├── judgement.jpg
│   ├── councillor.jpg
│   └── faith.jpg
└── palaces/              # 8 Palácios + Mementos + Maruki
    ├── kamoshida.jpg
    ├── madarame.jpg
    ├── kaneshiro.jpg
    ├── futaba.jpg
    ├── okumura.jpg
    ├── nijima.jpg
    ├── shido.jpg
    ├── mementos.jpg
    └── maruki.jpg
```

## Placeholders Atuais

O site usa placeholders SVG inline via `onerror` quando as imagens não são encontradas. Para produção, substitua por:

1. **Fan art oficial** (com permissão do artista)
2. **Screenshots próprios** do jogo
3. **Arte conceitual** da artbook oficial
4. **Imagens promocionais** da ATLUS (verificar licença)

## Especificações Recomendadas

| Tipo | Dimensões | Formato | Qualidade |
|------|-----------|---------|-----------|
| Characters | 300x400 (3:4) | WebP/JPG | 80% |
| Confidants | 200x200 (1:1) | WebP/JPG | 80% |
| Palaces | 400x225 (16:9) | WebP/JPG | 80% |
| OST Artwork | 300x300 (1:1) | WebP/JPG | 80% |

## Otimização

```bash
# Converter para WebP (melhor compressão)
cwebp -q 80 input.jpg -o output.webp

# Redimensionar mantendo proporção
magick input.jpg -resize 300x400^ -gravity center -extent 300x400 output.jpg
```

## Créditos

Se usar arte de fãs, sempre credite o artista:
- Nome/handle do artista
- Link para portfolio (Twitter, Pixiv, ArtStation)
- Licença (CC-BY, CC-BY-SA, etc.)