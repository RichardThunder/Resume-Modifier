package main

import (
	"encoding/json"
	"net/http"
)

func main() {
	// 路由配置
	http.HandleFunc("/api/pdfupload/", handlePDFUpload)

	// 启动服务器
	serverAddr := ":8080"
	println("Server running at http://localhost" + serverAddr)
	if err := http.ListenAndServe(serverAddr, nil); err != nil {
		panic(err)
	}
}

// 处理 /api/pdfupload/ 路径的请求
func handlePDFUpload(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*") // 允许所有来源访问
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// 设置响应头
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// JSON 数据
	response := map[string]interface{}{
		"status": 200,
		"data": map[string]interface{}{
			"userInfo": map[string]string{
				"firstName":               "John",
				"lastName":                "Doe",
				"headLine":                "Software Engineer",
				"phoneNumber":             "+123456789",
				"email":                   "johndoe@example.com",
				"linkedInURL":             "https://www.linkedin.com/in/johndoe",
				"websiteOrOtherProfileURL": "https://johndoe.com",
			},
			"summary": "Experienced software engineer with a passion for building scalable web applications and solving complex problems.",
			"workExperience": []map[string]interface{}{
				{
					"companyName": "TechCorp",
					"jobTitle":    "Software Engineer",
					"city":        "New York",
					"country":     "USA",
					"fromDate":    "2020-01-01",
					"toDate":      "2023-12-31",
					"isPresent":   false,
					"description": "Developed backend services and APIs for enterprise-level applications.",
				},
				{
					"companyName": "DevWorks",
					"jobTitle":    "Junior Developer",
					"city":        "San Francisco",
					"country":     "USA",
					"fromDate":    "2018-06-01",
					"toDate":      "2019-12-31",
					"isPresent":   false,
					"description": "Worked on front-end development and UI design for client projects.",
				},
			},
			"education": []map[string]interface{}{
				{
					"institutionName": "Chongqing University",
					"fieldOfStudy":    "Software Engineering",
					"degree":          "Bachelor's",
					"grade":           "A",
					"city":            "Chongqing",
					"country":         "China",
					"fromDate":        "2014-09-01",
					"toDate":          "2018-06-30",
					"isPresent":       false,
					"description":     "Graduated with honors, specializing in web development.",
				},
				{
					"institutionName": "MIT",
					"fieldOfStudy":    "Computer Science",
					"degree":          "Master's",
					"grade":           "A+",
					"city":            "Cambridge",
					"country":         "USA",
					"fromDate":        "2019-09-01",
					"toDate":          "2021-06-30",
					"isPresent":       false,
					"description":     "Focused on machine learning and AI research.",
				},
			},
			"skills": []string{"Java", "Python", "JavaScript"},
			"achievements": "Developed an award-winning application for e-commerce sales optimization.",
			"project": []map[string]interface{}{
				{
					"title":       "Inventory Management System",
					"projectRole": "Lead Developer",
					"city":        "Shanghai",
					"country":     "China",
					"fromDate":    "2022-01-01",
					"toDate":      "2022-12-31",
					"isPresent":   false,
					"description": "Led the development of a scalable inventory management system for a retail client.",
				},
			},
			"award": []map[string]interface{}{
				{
					"name":         "Best Software Engineer of the Year",
					"issuer":       "TechCorp",
					"urlToAward":   "https://www.techcorp.com/awards/best-software-engineer-2021",
					"dateOfAward":  "2021-12-15",
					"description":  "Awarded for outstanding contributions to the company's development team.",
				},
			},
			"certifications": []map[string]interface{}{
				{
					"name":        "Oracle Certified Java Developer",
					"issuer":      "Oracle",
					"date":        "2020-08-01",
					"expiryDate":  "2023-08-01",
					"url":         "https://www.oracle.com/certifications/java-developer",
					"description": "Certified Java Developer after completing the official Oracle certification program.",
				},
			},
		},
	}

	// 将 JSON 数据写入响应
	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding JSON", http.StatusInternalServerError)
	}
}