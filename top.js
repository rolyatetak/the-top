const svg = d3.select("svg")

data = data.map((d,i) => {
  d.difference = d.imdb - d.metascore
  return d
})

svg
  .attr("height", 40 * data.length)
	.attr("width", "100%")

const scoreScale = d3.scaleLinear()
	.domain([0, 100])
	.range([420, 900])

const area = d3.area()
	.x0((d,i) => {
    return scoreScale(d.imdb)
  })
	.x1((d,i) => {
    return scoreScale(d.metascore)
  })
	.y0((d,i) => {
    return 40 * i + 20
  })
	.y1((d,i) => {
    return 40 * i + 20
  })

const areaPath = svg
	.append("path")
	.datum(data)
	.attr("class","area")
	.attr("d",area)

const metaLine = d3.line()
	.x((d,i) => {
    return scoreScale(d.metascore)
  })
	.y((d,i) => {
    return 40 * i + 20
  })

const metaPath = svg
	.append("path")
	.attr("class","meta")
	.datum(data)
	.attr("d",metaLine)

const imdbLine = d3.line()
	.x((d,i) => {
    return scoreScale(d.imdb)
  })
	.y((d,i) => {
    return 40 * i + 20
  })

const imdbPath = svg
	.append("path")
	.attr("class","imdb")
	.datum(data)
	.attr("d",imdbLine)

const groups = svg
	.selectAll("g.movie")
	.data(data)
	.enter().append("g")
	.attr("class", "movie")
	.attr("transform", (d,i) => {
    return `translate(0, ${i * 40})`
  })

groups
	.append("rect")
	.attr("width",960)
	.attr("height",40)
	.attr("x",0)
	.attr("y",0)
	.attr("class","bg")

groups
	.append("text")
	.attr("x",90)
	.attr("y",20)
	.attr("class","title")
	.text((d,i) => {
  return d.title
})

groups
	.append("text")
	.attr("x",24)
	.attr("y",20)
	.attr("class","year")
	.text((d,i) => {
  return d.year
})

groups
	.append("circle")
	.attr("cx",(d,i) => {
  return scoreScale(d.metascore)
})
	.attr("cy",20)
	.attr("class","meta")
	.attr("r",0)
  	.transition().duration(1000)
	.attr("r",8)

groups
	.append("circle")
	.attr("cx",(d,i) => {
  return scoreScale(d.imdb)
})
	.attr("cy",20)
	.attr("class","imdb")
	.attr("r",0)
  	.transition().duration(1000).delay(500)
	.attr("r",8)

groups
	.append("text")
	.attr("x",(d,i) => {
  if (d.difference > 0) {
    return scoreScale(d.imdb) + 15
  }
  else {
    return scoreScale(d.imdb) - 15
  }
})
	.attr("y",20)
	.attr("class","imdb")
	.text((d,i) => {return d.imdb})
	.style("text-anchor",(d,i) => {
  if (d.difference > 0) {
    return "start"
  } else {
    return "end"
  }
})

groups
	.append("text")
	.attr("x",(d,i) => {
  if (d.difference > 0) {
    return scoreScale(d.metascore) - 15
  }
  else {
    return scoreScale(d.metascore) + 15
  }
})
	.attr("y",20)
	.attr("class","meta")
	.text((d,i) => {return d.metascore})
	.style("text-anchor",(d,i) => {
  if (d.difference > 0) {
    return "end"
  } else {
    return "start"
  }
})
	


const selectTag = document.querySelector("select")

selectTag.addEventListener("change",function(){
  data.sort((a,b) => {
    if (this.value == "imdb") {
      return d3.descending(a.imdb,b.imdb)
    }
    if (this.value == "metascore") {
      return d3.descending(a.metascore,b.metascore)  
    }
    if (this.value == "year") {
       return d3.ascending(a.year,b.year)
    }
    if (this.value == "title") {
       return d3.ascending(a.title,b.title)
    }
    if (this.value == "diff") {
      return d3.ascending(a.difference,b.difference)
    }
  })
  
  groups
  	.data(data,(d,i) => {
    return d.title
  })
  	.transition().duration(750)
  	.attr("transform", (d,i) => {
    return `translate(0, ${i * 40})`
  })
  
  imdbPath
  	.datum(data,(d,i) => {
    return d.title
  })
  	.transition().duration(750)
  	.attr("d",imdbLine)
  
  metaPath
  	.datum(data,(d,i) => {
    return d.title
  })
  	.transition().duration(750)
  	.attr("d",metaLine)
  
  areaPath
  	.datum(data,(d,i) => {
    return d.title
  })
  	.transition().duration(750)
  	.attr("d",area)
})



const resize = function() {
 const svgTag = document.querySelector("svg")
 const svgWidth = svgTag.clientWidth
 
 scoreScale
 	.range([420 / 960 * svgWidth, 900 / 960 * svgWidth])
  
groups
	.selectAll("circle.meta")
  .attr("cx",(d,i) => {
  return scoreScale(d.metascore)
})
  
  groups
	.selectAll("circle.imdb")
  .attr("cx",(d,i) => {
  return scoreScale(d.imdb)
})
  
  groups
  	.selectAll("text.title")
  	.attr("x", (svgWidth >= 500) ? 90 : 50)
  
  groups
  	.selectAll("text.year")
  	.attr("x", (svgWidth >= 500) ? 24 : 4)
  
  metaLine
  	.x((d,i) => {
    return scoreScale(d.metascore)
  })
  
  metaPath
  	.attr("d",metaLine)
  
  imdbLine
  	.x((d,i) => {
    return scoreScale(d.imdb)
  })
  
  imdbPath
  	.attr("d",imdbLine)
  
  area
	.x0((d,i) => {
    return scoreScale(d.imdb)
  })
	.x1((d,i) => {
    return scoreScale(d.metascore)
  })
  
  areaPath
  	.attr("d",area)
  
}

resize()

window.addEventListener("resize", function () {
 resize() 
})

