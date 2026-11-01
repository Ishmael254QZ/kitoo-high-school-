from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from django.conf import settings
import json

# MongoDB connection
client = MongoClient(settings.MONGODB_URI)
db = client.get_database()

@api_view(['GET'])
def student_performance_report(request):
    """Generate student performance analytics report"""
    try:
        # Aggregate student performance data
        pipeline = [
            {
                '$lookup': {
                    'from': 'results',
                    'localField': '_id',
                    'foreignField': 'studentId',
                    'as': 'results'
                }
            },
            {
                '$project': {
                    'name': 1,
                    'class': 1,
                    'averageScore': {'$avg': '$results.totalScore'},
                    'resultCount': {'$size': '$results'}
                }
            }
        ]
        
        students = list(db.students.aggregate(pipeline))
        
        return Response({
            'success': True,
            'data': students,
            'total_students': len(students)
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def fee_collection_report(request):
    """Generate fee collection analytics"""
    try:
        fees = list(db.fees.find())
        total_expected = sum([f.get('amount', 0) for f in fees])
        total_collected = sum([f.get('amount', 0) for f in fees if f.get('status') == 'paid'])
        
        return Response({
            'success': True,
            'data': {
                'total_expected': total_expected,
                'total_collected': total_collected,
                'outstanding': total_expected - total_collected,
                'collection_rate': (total_collected / total_expected * 100) if total_expected > 0 else 0
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def kcse_analytics(request):
    """KCSE performance analytics"""
    try:
        year = request.query_params.get('year', '2023')
        results = list(db.results.find({'year': year, 'examType': 'KCSE'}))
        
        # Calculate statistics
        total_students = len(results)
        if total_students > 0:
            mean_score = sum([r.get('meanGrade', 0) for r in results]) / total_students
            grade_counts = {}
            for r in results:
                grade = r.get('meanGrade', 'F')
                grade_counts[grade] = grade_counts.get(grade, 0) + 1
        else:
            mean_score = 0
            grade_counts = {}
        
        return Response({
            'success': True,
            'data': {
                'year': year,
                'total_students': total_students,
                'mean_score': mean_score,
                'grade_distribution': grade_counts
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
